
// client/src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext , Link } from "react-router-dom";
import {
  useStripe,
  useElements,
  CardNumberElement,
} from "@stripe/react-stripe-js";


import { users } from "../mock-data/users";
import { useAuth } from "../context/AuthContext.js";
import { PAYMENT_METHODS } from "../constants/checkout";
import { useProducts } from "../context/ProductsContext.js";
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
import PaymentArchitectureToggle from "../components/checkout/PaymentArchitectureToggle";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  // 🌟 ตรวจจับกรณีลูกค้ากดย้อนกลับมาจาก Stripe (?canceled=true)
  const isCanceledFromStripe =
    new URLSearchParams(window.location.search).get("canceled") === "true";

  const { currentUser: authUser } = useAuth();
  const currentUser = authUser || users[0];
  const currentUserId = currentUser?.id || "USR-001";

  // State สลับระบบชำระเงิน ('v2' = Stripe Hosted | 'v1' = In-App UI)
  const [paymentVersion, setPaymentVersion] = useState("v2");

  const { 
    cartItems: outletCartItems = [], 
    handleClearCart,
    handleAddToCart,
    selectedPlan: contextSelectedPlan = null,
    setSelectedPlan: contextSetSelectedPlan = () => {},
  } = useOutletContext() || {};
  const cartItems = outletCartItems;
  const { products = [] } = useProducts();

  // ใช้ selectedPlan จาก context ถ้ามี ถ้าไม่มีใช้ local
  const [localPlan, setLocalPlan] = useState(null);
  const selectedPlan = contextSelectedPlan !== undefined ? contextSelectedPlan : localPlan;
  const setSelectedPlan = contextSetSelectedPlan || setLocalPlan;

  // State ทั่วไป
  const [errors, setErrors] = useState({});
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [promptPayModalState, setPromptPayModalState] = useState(null);
  const [countdown, setCountdown] = useState(300);
  const [pendingOrderPayload, setPendingOrderPayload] = useState(null);

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

  // คำนวณค่าเมนูเสริม A La Carte ในกรณีที่มีเมนูเกินจากโควตาแพ็กเกจ
  let extraSubtotal = 0;
  if (selectedPlan && kitsDifference > 0) {
    let countedInBox = 0;
    cartItems.forEach((item) => {
      const q = Number(item.quantity) || 1;
      const space = requiredKits - countedInBox;
      if (space <= 0) {
        extraSubtotal += (Number(item.price) || 0) * q;
      } else if (q > space) {
        extraSubtotal += (Number(item.price) || 0) * (q - space);
        countedInBox += space;
      } else {
        countedInBox += q;
      }
    });
  }

  const itemsSubtotal = selectedPlan
    ? selectedPlan.price + extraSubtotal
    : cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);

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

  // ส่งข้อมูลคำสั่งซื้อและนำทางไปหน้าสำเร็จ (v1)
  const finalizeOrder = async (orderPayload) => {
    const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");
    try {
      const response = await fetch(`${apiUrl}/api/v1/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (handleClearCart) handleClearCart();
      const result = response.ok ? await response.json() : null;
      const finalOrder = result?.order || orderPayload;
      try {
        const saved = JSON.parse(localStorage.getItem("recent_orders") || "[]");
        localStorage.setItem("recent_orders", JSON.stringify([finalOrder, ...saved.slice(0, 49)]));
      } catch {
        // ignore localStorage error
      }
      navigate("/order-success", {
        state: { order: finalOrder },
      });
    } catch (err) {
      if (handleClearCart) handleClearCart();
      try {
        const saved = JSON.parse(localStorage.getItem("recent_orders") || "[]");
        localStorage.setItem("recent_orders", JSON.stringify([orderPayload, ...saved.slice(0, 49)]));
      } catch {
        // ignore localStorage error
      }
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

    const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");

    const orderPayload = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: currentUserId,
      planType: selectedPlan ? selectedPlan.id : "SINGLE_KIT",
      planDetails: selectedPlan
        ? {
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            kitsPerWeek: selectedPlan.kitsPerWeek,
            planPrice: selectedPlan.price,
          }
        : null,
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
    // โหมด v2: Stripe Hosted Checkout (Redirect ไปหน้า Stripe)
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
          // 🌟 บันทึกข้อมูลคำสั่งซื้อไว้ใน sessionStorage ก่อนเด้งไปหน้า Stripe
          sessionStorage.setItem(
            "last_v2_order",
            JSON.stringify({
              ...orderPayload,
              orderId: data.orderId || orderPayload.orderId,
            }),
          );

          // ⚠️ ไม่สั่ง handleClearCart() ตรงนี้ เพื่อให้ของในตะกร้าไม่หายถ้าลูกค้ากดย้อนกลับมา
          // 🚀 เด้งไปหน้าชำระเงินของ Stripe ทันที!
          window.location.href = data.url;
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
    // โหมด v1: In-App Checkout (สไตล์ Shopee)
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

  // กรณีผู้ใช้เป็น Admin (ไม่มีสิทธิ์สั่งซื้อสินค้า)
  if (authUser?.role === "admin") {
    return (
      <div className="min-h-[70vh] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center text-[#2f2119]">
        <div className="w-20 h-20 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center text-amber-800 text-3xl mb-4 shadow-xs">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-[#4c1f08] mb-2">
          ผู้ดูแลระบบ (Admin) ไม่มีสิทธิ์สั่งซื้อสินค้า
        </h2>
        <p className="text-sm text-[#7a5c4d] max-w-md mb-6 leading-relaxed">
          บัญชีของคุณมีสิทธิ์ระดับผู้ดูแลระบบร้านค้า สำหรับจัดการระบบหลังบ้านเท่านั้น
          หากต้องการทดสอบการสั่งซื้อ กรุณาเข้าสู่ระบบด้วยบัญชีลูกค้าทั่วไป
        </p>
        <div className="flex gap-3">
          <Link
            to="/admin/dashboard"
            className="rounded-full bg-[#4c1f08] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#6b3215] transition-colors cursor-pointer"
          >
            ไปยังแดชบอร์ด
          </Link>
          <Link
            to="/menus"
            className="rounded-full border border-[#d9cbbd] bg-white px-6 py-2.5 text-xs font-bold text-[#4c1f08] hover:bg-[#f1ead7] transition-colors cursor-pointer"
          >
            ดูรายการเมนู
          </Link>
        </div>
      </div>
    );
  }

  // กรณีไม่มีสินค้าในตะกร้า
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
        {/* 🌟 แสดงแถบแจ้งเตือนสีส้มเมื่อลูกค้ากดย้อนกลับมาจาก Stripe */}
        {isCanceledFromStripe && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3.5 text-left shadow-sm animate-in fade-in">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-bold text-amber-900">
                การชำระเงินยังไม่เสร็จสมบูรณ์ หรือถูกยกเลิก
              </p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                สินค้าทั้งหมดยังคงอยู่ในตะกร้าของคุณอย่างปลอดภัย
                ท่านสามารถตรวจสอบข้อมูล เลือกช่องทางการชำระเงินอื่น
                หรือกดลองใหม่อีกครั้งได้ทันทีครับ
              </p>
            </div>
          </div>
        )}

        {/* ส่วนหัวหน้า Checkout */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-[#8d593a] font-bold">
            Checkout Process
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#3d2c2e] mt-1">
            ยืนยันการสั่งซื้อ
          </h1>
        </div>

        {/* แถบสลับโหมด v1 vs v2 */}
        <PaymentArchitectureToggle
          paymentVersion={paymentVersion}
          onToggleVersion={setPaymentVersion}
        />

        {/* ข้อมูลสมาชิก */}
        <CheckoutUserStatus currentUser={currentUser} />

        {/* ข้อมูลแพ็กเกจที่เลือกมาจากหน้าตะกร้า */}
        {selectedPlan ? (
          <div className="mb-6 bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-4 sm:p-5 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#f6ede5] flex items-center justify-center text-[#8d593a] border border-[#e8dfd1] shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#3d2c2e]">
                    กล่อง Cooking Kit ประจำสัปดาห์: {selectedPlan.name}
                  </h3>
                  <span className="text-[10px] bg-[#8d593a] text-white px-2.5 py-0.5 rounded-full font-bold">
                    {selectedPlan.kitsPerWeek} Kits
                  </span>
                </div>
                <p className="text-xs text-[#6f675f] mt-0.5">
                  {selectedPlan.description} • ราคาเหมาจ่าย ฿{selectedPlan.price.toLocaleString()} / สัปดาห์
                </p>
              </div>
            </div>
            <Link
              to="/cart"
              className="text-xs text-[#8d593a] font-bold hover:underline shrink-0 ml-2"
            >
              แก้ไขในตะกร้า →
            </Link>
          </div>
        ) : (
          <div className="mb-6 bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-4 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f6ede5] flex items-center justify-center text-[#8d593a] border border-[#e8dfd1] shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#3d2c2e]">รูปแบบการสั่งซื้อ: A La Carte (ซื้อแยกตามชุด)</h3>
                <p className="text-xs text-[#6f675f]">คิดราคาตามรายการอาหารที่เลือก</p>
              </div>
            </div>
            <Link
              to="/cart"
              className="text-xs text-[#8d593a] font-bold hover:underline shrink-0 ml-2"
            >
              เลือกแบบแพ็กเกจกล่องในตะกร้า →
            </Link>
          </div>
        )}

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
