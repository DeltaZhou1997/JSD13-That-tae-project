import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";

import { users } from "../mock-data/users";
import { useAuth } from "../context/AuthContext.js";
import { SUBSCRIPTION_PLANS, PAYMENT_METHODS } from "../constants/checkout";
import {
  calculateEarnedPoints,
  calculateGrandTotal,
  generatePromptPayQrUrl,
} from "../utils/checkoutHelpers";

import CheckoutUserStatus from "../components/checkout/CheckoutUserStatus";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import CheckoutSummary from "../components/checkout/CheckoutSummary";

export default function CheckoutPage() {
  const navigate = useNavigate();

  // Stripe Hooks
  const stripe = useStripe();
  const elements = useElements();

  // Auth Context
  const { currentUser: authUser } = useAuth();
  const currentUser = authUser || users[0];
  const currentUserId = currentUser?.id || "USR-001";

  // Plan Selector
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Errors & Loading state
  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Cart Context
  const { cartItems: outletCartItems = [], handleClearCart } =
    useOutletContext() || {};
  const cartItems = outletCartItems;

  // Form Data
  const [formData, setFormData] = useState({
    fullName: `${currentUser.firstName} ${currentUser.lastName}`,
    phone: currentUser.phone || "",
    address: "123/45 ถนนวงศ์สว่าง",
    district: "บางซื่อ",
    province: "กรุงเทพมหานคร",
    zipcode: "10800",
    deliveryDate: "12",
  });

  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvc: "",
  });

  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.PROMPTPAY);

  // การคำนวณราคา & สิทธิ์
  const totalKitsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const requiredKits = selectedPlan ? selectedPlan.kitsPerWeek : 0;
  const kitsDifference = selectedPlan ? totalKitsCount - requiredKits : 0;

  const itemsSubtotal = selectedPlan
    ? selectedPlan.price
    : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const earnedPoints = calculateEarnedPoints(itemsSubtotal);
  const grandTotal = calculateGrandTotal(itemsSubtotal);
  const promptPayQrUrl = generatePromptPayQrUrl("0812345678", grandTotal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  // =========================================================================
  // จุดประมวลผลการสั่งซื้อ & ชำระเงิน
  // =========================================================================
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // 1. ตรวจสอบที่อยู่จัดส่ง
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!formData.phone.trim()) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^[0-9-]{9,12}$/.test(formData.phone.trim())) {
      newErrors.phone = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
    }
    if (!formData.address.trim()) newErrors.address = "กรุณากรอกที่อยู่จัดส่ง";
    if (!formData.district.trim()) newErrors.district = "กรุณากรอกอำเภอ/เขต";
    if (!formData.province.trim()) newErrors.province = "กรุณากรอกจังหวัด";
    if (!formData.zipcode.trim()) {
      newErrors.zipcode = "กรุณากรอกรหัสไปรษณีย์";
    } else if (!/^\d{5}$/.test(formData.zipcode.trim())) {
      newErrors.zipcode = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    }

    if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
      if (!cardData.cardName.trim()) {
        newErrors.cardName = "กรุณากรอกชื่อบนบัตร";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsProcessingPayment(true);

    let stripePaymentIntentId = null;
    let isFallbackPayment = false;

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

      // =====================================================================
      // FLOW A: บัตรเครดิตผ่าน Stripe (มีการดักจับข้อผิดพลาดอย่างเข้มงวด)
      // =====================================================================
      if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
        let piData;
        try {
          const piResponse = await fetch(
            `${apiUrl}/api/v1/payment/create-payment-intent`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: grandTotal,
                paymentMethodType: "card",
              }),
            },
          );

          if (!piResponse.ok) {
            throw new Error("GATEWAY_DOWN");
          }

          piData = await piResponse.json();
        } catch (netErr) {
          // 🚨 ดักจับเคส Stripe ล่ม / ปิดเซิร์ฟเวอร์ / เน็ตหลุด
          setErrors({
            payment:
              "ระบบชำระเงินผ่านบัตรเครดิตขัดข้องชั่วคราว ไม่สามารถทำรายการได้ กรุณาเลือกชำระผ่าน 'พร้อมเพย์' หรือ 'เก็บเงินปลายทาง'",
          });
          setIsProcessingPayment(false);
          return; // ⛔ บล็อกการทำงานทันที ห้ามไปหน้าสำเร็จ!
        }

        if (!piData.success) {
          setErrors({
            payment: piData.message || "ไม่สามารถเชื่อมต่อระบบบัตรเครดิตได้",
          });
          setIsProcessingPayment(false);
          return;
        }

        stripePaymentIntentId = piData.paymentIntentId;

        // ดำเนินการตัดเงินผ่าน Stripe
        if (!piData.isMock && stripe && elements) {
          const cardElement = elements.getElement(CardNumberElement);
          const { error, paymentIntent } = await stripe.confirmCardPayment(
            piData.clientSecret,
            {
              payment_method: {
                card: cardElement,
                billing_details: {
                  name: cardData.cardName || formData.fullName,
                },
              },
            },
          );

          if (error) {
            setErrors({ payment: `การชำระเงินไม่สำเร็จ: ${error.message}` });
            setIsProcessingPayment(false);
            return; // ⛔ บัตรถูกปฏิเสธ ห้ามไปต่อ
          }
        }
      }

      // =====================================================================
      // FLOW B: PromptPay (พร้อมระบบ Fallback เมื่อ Stripe ล่ม)
      // =====================================================================
      if (paymentMethod === PAYMENT_METHODS.PROMPTPAY) {
        try {
          const piResponse = await fetch(
            `${apiUrl}/api/v1/payment/create-payment-intent`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                amount: grandTotal,
                paymentMethodType: "promptpay",
              }),
            },
          );
          const piData = await piResponse.json();
          if (piData.success) {
            stripePaymentIntentId = piData.paymentIntentId;
          } else {
            isFallbackPayment = true;
          }
        } catch (err) {
          // หากเชื่อมต่อ Stripe ไม่สำเร็จ ให้เปิดโหมด Fallback สลับไปตรวจสลิป
          console.warn("⚠️ Stripe ไม่ตอบสนอง สลับไปใช้ PromptPay สำรอง");
          isFallbackPayment = true;
        }
      }

      // จัด Payload ส่งบันทึก Order
      const orderPayload = {
        orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        userId: currentUserId,
        planType: selectedPlan ? selectedPlan.id : "SINGLE_KIT",
        items: cartItems.map((item) => {
          const targetId = item.productId || item.id || item._id;
          const itemPrice = Number(item.price) || 0;
          const itemQty = Number(item.quantity) || 1;
          return {
            productId: targetId,
            product: targetId,
            productName:
              item.name || item.nameTh || item.productName || "ชุด Cooking Kit",
            price: itemPrice,
            quantity: itemQty,
            unitPrice: itemPrice,
            subtotal: itemPrice * itemQty,
          };
        }),
        shippingAddress: {
          fullName: formData.fullName,
          recipientName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          district: formData.district,
          province: formData.province,
          zipcode: formData.zipcode,
          fullAddress: `${formData.address} เขต/อำเภอ${formData.district} จังหวัด${formData.province} ${formData.zipcode}`,
          deliveryDate: formData.deliveryDate,
        },
        paymentMethod: paymentMethod,
        isFallbackPayment: isFallbackPayment,
        stripePaymentIntentId: stripePaymentIntentId,
        itemsSubtotal,
        shippingFee: 60,
        grandTotal,
        earnedPoints,
        createdAt: new Date().toISOString(),
      };

      // บันทึกคำสั่งซื้อเข้า Backend
      const response = await fetch(`${apiUrl}/api/v1/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (handleClearCart) handleClearCart();
        navigate("/order-success", {
          state: { order: result.order || orderPayload },
        });
      } else {
        // หากส่งเข้าเซิร์ฟเวอร์ไม่ได้ แต่เป็นบัตรเครดิต ห้ามปล่อยผ่าน
        if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
          setErrors({
            payment:
              "ไม่สามารถบันทึกคำสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่",
          });
          setIsProcessingPayment(false);
          return;
        }

        if (handleClearCart) handleClearCart();
        navigate("/order-success", { state: { order: orderPayload } });
      }
    } catch (err) {
      // 🚨 จุดดักจับข้อผิดพลาดทั่วไป: หากเป็นบัตรเครดิต ห้ามพาไปหน้าสำเร็จเด็ดขาด!
      if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
        setErrors({
          payment:
            "เกิดข้อผิดพลาดในการตัดบัตรเครดิต การชำระเงินยังไม่สมบูรณ์ กรุณาลองใหม่อีกครั้ง หรือเปลี่ยนช่องทางชำระเงิน",
        });
        setIsProcessingPayment(false);
        return;
      }

      // ถ้าเป็น PromptPay ที่เซิร์ฟเวอร์ดับ ยอมให้ไปหน้าสำเร็จพร้อมโหมดแนบสลิป
      if (handleClearCart) handleClearCart();
      navigate("/order-success", {
        state: {
          order: {
            orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
            paymentMethod,
            grandTotal,
            earnedPoints,
            isFallbackPayment: true,
            shippingAddress: {
              fullName: formData.fullName,
              phone: formData.phone,
              address: `${formData.address} เขต/อำเภอ${formData.district} จังหวัด${formData.province} ${formData.zipcode}`,
              deliveryDate: formData.deliveryDate,
            },
          },
        },
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // กรณีไม่มีสินค้าในตะกร้า
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center text-[#2f2119]">
        <div className="w-24 h-24 bg-[#fcf8f2] border border-[#e8dfd1] rounded-full flex items-center justify-center text-[#8d593a] mb-4 shadow-inner">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10"
            aria-hidden="true"
          >
            <path d="M3 9h18l-1.4 9H4.4L3 9Z" />
            <path d="m8 9 4-5 4 5M8 13v2m4-2v2m4-2v2" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#3d2c2e] mb-2">
          ยังไม่มีสินค้าในตะกร้าของคุณ
        </h2>
        <p className="text-[#6f675f] text-sm max-w-md mb-8">
          เลือกชุดวัตถุดิบพร้อมปรุง (Cooking Kit)
          ที่คุณชื่นชอบลงตะกร้าก่อนดำเนินการชำระเงิน
        </p>
        <button
          onClick={() => navigate("/menus")}
          className="bg-[#3d2c2e] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#8d593a] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          กลับไปเลือกเมนูอาหาร
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-[.22em] text-[#8d593a]">
            SECURE CHECKOUT
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3d2c2e] mt-1">
            ยืนยันการสั่งซื้อ
          </h1>
        </div>

        <CheckoutUserStatus currentUser={currentUser} />

        {/* Plan Selector */}
        <div className="mb-8 bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#3d2c2e] mb-3 flex items-center gap-2">
            <span>📦</span> เลือกรูปแบบการสั่งซื้อ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => setSelectedPlan(null)}
              className={`p-3.5 rounded-2xl border text-center transition-all ${
                selectedPlan === null
                  ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md"
                  : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a]"
              }`}
            >
              <div className="font-bold text-sm">A La Carte</div>
              <div className="text-xs opacity-80 mt-0.5">ซื้อแยกรายชุด</div>
            </button>

            {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan)}
                className={`p-3.5 rounded-2xl border text-center transition-all relative ${
                  selectedPlan?.id === plan.id
                    ? "bg-[#3d2c2e] text-white border-[#3d2c2e] shadow-md"
                    : "bg-white text-[#2f2119] border-[#e8dfd1] hover:border-[#8d593a]"
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[9px] bg-[#8d593a] text-white px-2 py-0.5 rounded-full font-bold">
                    ยอดนิยม
                  </span>
                )}
                <div className="font-bold text-sm">{plan.name}</div>
                <div className="text-xs opacity-90 font-semibold mt-0.5">
                  ฿{plan.price}/สัปดาห์
                </div>
                <div className="text-[10px] opacity-75 mt-0.5">
                  ({plan.kitsPerWeek} Kits)
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ฟอร์มจัดส่งและสรุปราคา */}
        <form
          onSubmit={handleSubmitOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        >
          <div className="lg:col-span-7 flex flex-col gap-6">
            <ShippingForm
              formData={formData}
              onChange={handleInputChange}
              onDateChange={(date) =>
                setFormData((prev) => ({ ...prev, deliveryDate: date }))
              }
              errors={errors}
            />
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              promptPayQrUrl={promptPayQrUrl}
              cardData={cardData}
              onCardInputChange={handleCardInputChange}
              paymentError={errors.payment}
            />
          </div>

          <div className="lg:col-span-5">
            <CheckoutSummary
              cartItems={cartItems}
              selectedPlan={selectedPlan}
              itemsSubtotal={itemsSubtotal}
              grandTotal={grandTotal}
              earnedPoints={earnedPoints}
              totalKitsCount={totalKitsCount}
              requiredKits={requiredKits}
              kitsDifference={kitsDifference}
              isProcessingPayment={isProcessingPayment}
              paymentMethod={paymentMethod}
            />
          </div>
        </form>
      </div>

      {/* Loading Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4">
            <div className="w-16 h-16 border-4 border-[#8d593a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-bold text-[#3d2c2e]">
              {paymentMethod === PAYMENT_METHODS.COD
                ? "กำลังบันทึกคำสั่งซื้อ..."
                : "กำลังดำเนินการชำระเงิน..."}
            </p>
            <p className="text-xs text-[#6f675f] mt-2">กรุณาอย่าปิดหน้าจอ</p>
          </div>
        </div>
      )}
    </div>
  );
}
