import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";

import { users } from "../mock-data/users";
import { useAuth } from "../context/AuthContext.js";
import { PAYMENT_METHODS } from "../constants/checkout";
import {
  calculateEarnedPoints,
  calculateGrandTotal,
  generatePromptPayQrUrl,
} from "../utils/checkoutHelpers";

// Components
import CheckoutUserStatus from "../components/checkout/CheckoutUserStatus";
import ShippingForm from "../components/checkout/ShippingForm";
import PaymentMethodSelector from "../components/checkout/PaymentMethodSelector";
import CheckoutSummary from "../components/checkout/CheckoutSummary";
import PlanSelector from "../components/checkout/PlanSelector";
import PromptPayModal from "../components/checkout/PromptPayModal";
import PaymentArchitectureToggle from "../components/checkout/PaymentArchitectureToggle"; // 🌟 นำเข้า Toggle Component

export default function CheckoutPage() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { currentUser: authUser } = useAuth();
  const currentUser = authUser || users[0];
  const currentUserId = currentUser?.id || "USR-001";

  //  State สลับระบบชำระเงิน ('v2' = Stripe Hosted | 'v1' = In-App UI)
  const [paymentVersion, setPaymentVersion] = useState("v2");

  // State ทั่วไป
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [promptPayModalState, setPromptPayModalState] = useState(null);
  const [countdown, setCountdown] = useState(300);
  const [pendingOrderPayload, setPendingOrderPayload] = useState(null);

  const { cartItems: outletCartItems = [], handleClearCart } =
    useOutletContext() || {};
  const cartItems = outletCartItems;

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

  // คำนวณราคา & สิทธิ์
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

  // นับเวลาถอยหลังสำหรับ Modal PromptPay (เฉพาะ v1)
  useEffect(() => {
    let timer;
    if (promptPayModalState === "WAITING" && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0 && promptPayModalState === "WAITING") {
      setPromptPayModalState("FAILED");
    }
    return () => clearInterval(timer);
  }, [promptPayModalState, countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  // บันทึกคำสั่งซื้อสำหรับ v1 และกรณี COD
  const finalizeOrder = async (orderPayload) => {
    setIsProcessingPayment(true);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    try {
      const response = await fetch(`${apiUrl}/api/v1/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (handleClearCart) handleClearCart();
      const result = response.ok ? await response.json() : null;
      navigate("/order-success", {
        state: { order: result?.order || orderPayload },
      });
    } catch (err) {
      if (handleClearCart) handleClearCart();
      navigate("/order-success", { state: { order: orderPayload } });
    } finally {
      setIsProcessingPayment(false);
      setPromptPayModalState(null);
    }
  };

  // กดยืนยันการสั่งซื้อ
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // 1. ตรวจสอบฟอร์มที่อยู่จัดส่ง
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    if (!formData.phone.trim()) newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.address.trim()) newErrors.address = "กรุณากรอกที่อยู่จัดส่ง";
    if (!formData.district.trim()) newErrors.district = "กรุณากรอกอำเภอ/เขต";
    if (!formData.province.trim()) newErrors.province = "กรุณากรอกจังหวัด";
    if (!formData.zipcode.trim()) newErrors.zipcode = "กรุณากรอกรหัสไปรษณีย์";

    if (
      paymentVersion === "v1" &&
      paymentMethod === PAYMENT_METHODS.CREDIT_CARD &&
      !cardData.cardName.trim()
    ) {
      newErrors.cardName = "กรุณากรอกชื่อบนบัตร";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

    const orderPayload = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUserId,
      planType: selectedPlan ? selectedPlan.id : "SINGLE_KIT",
      items: cartItems.map((item) => ({
        productId: item.productId || item.id || item._id,
        productName: item.name || item.nameTh || "ชุด Cooking Kit",
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
      })),
      shippingAddress: { ...formData },
      paymentMethod,
      itemsSubtotal,
      shippingFee: 60,
      grandTotal,
      earnedPoints,
      createdAt: new Date().toISOString(),
    };

    // =========================================================================
    // โหมด v2: Stripe Hosted Checkout (Redirect ไปหน้า Stripe )
    // =========================================================================
    if (paymentVersion === "v2") {
      if (paymentMethod === PAYMENT_METHODS.COD) {
        await finalizeOrder(orderPayload);
        return;
      }

      setIsProcessingPayment(true);
      try {
        const res = await fetch(`${apiUrl}/api/v2/checkout/create-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderPayload),
        });
        const data = await res.json();

        if (data.success && data.url) {
          window.location.href = data.url; // 🚀 เด้งไปหน้าชำระเงินของ Stripe ทันที!
        } else {
          setErrors({
            payment:
              data.message || "ไม่สามารถสร้าง Stripe Checkout Session ได้",
          });
          setIsProcessingPayment(false);
        }
      } catch (err) {
        setErrors({
          payment:
            "เซิร์ฟเวอร์ v2 ยังไม่พร้อม หรือยังไม่ได้เปิด Route ใน Backend",
        });
        setIsProcessingPayment(false);
      }
      return;
    }

    // =========================================================================
    // โหมด v1: In-App Checkout (สไตล์ Shopee )
    // =========================================================================
    if (paymentMethod === PAYMENT_METHODS.PROMPTPAY) {
      setPendingOrderPayload(orderPayload);
      setCountdown(300);
      setPromptPayModalState("WAITING");
      return;
    }

    if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
      setIsProcessingPayment(true);
      try {
        const piRes = await fetch(
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
        const piData = await piRes.json();
        if (stripe && elements && !piData.isMock) {
          const cardEl = elements.getElement(CardNumberElement);
          const { error } = await stripe.confirmCardPayment(
            piData.clientSecret,
            {
              payment_method: {
                card: cardEl,
                billing_details: { name: cardData.cardName },
              },
            },
          );
          if (error) {
            setErrors({ payment: `การชำระเงินไม่สำเร็จ: ${error.message}` });
            setIsProcessingPayment(false);
            return;
          }
        }
        orderPayload.stripePaymentIntentId = piData.paymentIntentId;
        await finalizeOrder(orderPayload);
      } catch (err) {
        setErrors({
          payment: "ระบบชำระเงินผ่านบัตรขัดข้อง กรุณาเลือกวิธีอื่น",
        });
        setIsProcessingPayment(false);
      }
      return;
    }

    // COD
    await finalizeOrder(orderPayload);
  };

  const handleSwitchToCod = async () => {
    if (!pendingOrderPayload) return;
    setPaymentMethod(PAYMENT_METHODS.COD);
    await finalizeOrder({
      ...pendingOrderPayload,
      paymentMethod: PAYMENT_METHODS.COD,
    });
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center text-[#2f2119]">
        <div className="w-24 h-24 bg-[#fcf8f2] border border-[#e8dfd1] rounded-full flex items-center justify-center text-[#8d593a] mb-4 shadow-inner text-4xl">
          🛒
        </div>
        <h2 className="text-2xl font-bold mb-2">ไม่มีสินค้าในตะกร้า</h2>
        <button
          onClick={() => navigate("/menus")}
          className="mt-4 px-6 py-2.5 bg-[#8d593a] text-white rounded-full font-semibold hover:bg-[#72462c] transition cursor-pointer"
        >
          กลับไปเลือกเมนู
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] py-10 px-4 sm:px-6 lg:px-8 text-[#2f2119]">
      <div className="max-w-6xl mx-auto">
        {/* ส่วนหัวหน้า Checkout */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-[#8d593a] font-bold">
            Checkout Process
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3d2c2e] mt-1">
            ยืนยันการสั่งซื้อ
          </h1>
        </div>

        {/* 1. แถบสลับโหมด v1 vs v2 (ดึงเป็น Component บรรทัดเดียว คลีนตามาก) */}
        <PaymentArchitectureToggle
          paymentVersion={paymentVersion}
          onToggleVersion={setPaymentVersion}
        />

        {/* ข้อมูลสมาชิก */}
        <CheckoutUserStatus currentUser={currentUser} />

        {/* เลือกแพ็กเกจ A La Carte / Subscription */}
        <PlanSelector
          selectedPlan={selectedPlan}
          onSelectPlan={setSelectedPlan}
        />

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
              paymentVersion={paymentVersion}
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
              paymentVersion={paymentVersion}
            />
          </div>
        </form>
      </div>

      {/* Modal พร้อมเพย์ของ v1 */}
      <PromptPayModal
        modalState={promptPayModalState}
        onClose={() => setPromptPayModalState(null)}
        countdown={countdown}
        promptPayQrUrl={promptPayQrUrl}
        grandTotal={grandTotal}
        orderId={pendingOrderPayload?.orderId}
        onConfirmSuccess={() => finalizeOrder(pendingOrderPayload)}
        onSimulateFail={() => setPromptPayModalState("FAILED")}
        onRetry={() => {
          setCountdown(300);
          setPromptPayModalState("WAITING");
        }}
        onSwitchToCod={handleSwitchToCod}
      />

      {/* Loading Overlay */}
      {isProcessingPayment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-sm mx-4">
            <div className="w-16 h-16 border-4 border-[#8d593a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-bold text-[#3d2c2e]">
              {paymentVersion === "v2" && paymentMethod !== PAYMENT_METHODS.COD
                ? "กำลังนำท่านไปยัง Stripe Gateway..."
                : "กำลังบันทึกคำสั่งซื้อ..."}
            </p>
            <p className="text-xs text-[#6f675f] mt-2">กรุณาอย่าปิดหน้าจอ</p>
          </div>
        </div>
      )}
    </div>
  );
}
