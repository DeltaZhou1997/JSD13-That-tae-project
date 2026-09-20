import React, { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

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

  // เชื่อมต่อคนที่ 5 & 1: Auth Context จากระบบล็อกอิน
  const { currentUser: authUser } = useAuth();
  const currentUser = authUser || users[0];
  const currentUserId = currentUser?.id || "USR-001";

  // จุดเชื่อมต่อคนที่ 4: รูปแบบการสั่งซื้อ (Plan Selector)
  const [selectedPlan, setSelectedPlan] = useState(null);

  // State สำหรับเก็บข้อความ Inline Error แจ้งเตือนสีแดงใต้ช่องกรอก
  const [errors, setErrors] = useState({});

  // เชื่อมต่อคนที่ 3: Cart Items จาก Outlet Context ของ Layout
  const { cartItems: outletCartItems = [], handleClearCart } = useOutletContext() || {};
  const cartItems = outletCartItems;

  // State จัดการข้อมูลฟอร์มจัดส่ง และ ข้อมูลบัตรเครดิต
  // -------------------------------------------------------------------------
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

  // ระบบคำนวณโควต้าแพ็กเกจ & คำนวณราคาสินค้า
  // -------------------------------------------------------------------------
  // 1. totalKitsCount: จำนวนชุดอาหารรวมทั้งหมดในตะกร้า
  // 2. requiredKits: จำนวนชุดที่แพ็กเกจต้องการ (เช่น SIZE M ต้องการ 6 ชุด)
  // 3. kitsDifference: ผลต่าง (ติดลบ = เลือกขาด | เป็น 0 = ครบพอดี | เป็นบวก = เลือกเกิน)

  const totalKitsCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const requiredKits = selectedPlan ? selectedPlan.kitsPerWeek : 0;
  const kitsDifference = selectedPlan ? totalKitsCount - requiredKits : 0;

  // คำนวณยอดรวมสินค้า: ถ้าเลือก Plan จะคิดราคาเหมาตามแพ็กเกจ แต่ถ้าไม่เลือก (null) จะคิดรวมรายชุดตามจริง
  const itemsSubtotal = selectedPlan
    ? selectedPlan.price
    : cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const earnedPoints = calculateEarnedPoints(itemsSubtotal);
  const grandTotal = calculateGrandTotal(itemsSubtotal);
  const promptPayQrUrl = generatePromptPayQrUrl("0812345678", grandTotal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // ล้างข้อความเตือนเมื่อผู้ใช้เริ่มพิมพ์แก้ไข
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  // จุดเชื่อมต่อการชำระเงิน และ บันทึกคำสั่งซื้อ (เชื่อมคน 1, 3, 4, 5)
  // -------------------------------------------------------------------------
  // 1. ตรวจสอบ Validation ฟอร์ม (Inline Errors ไม่ใช้ alert)
  // 2. จัดโครงสร้าง Payload ต้องดูดีๆอีกทีตอนรวมโค้ด
  //    - เชื่อมคนที่ 1 (Admin/Products): ตรวจว่าส่ง productId และ quantity ตรงกับ Schema ที่คน 1 ตั้งไว้ไหม
  //    - เชื่อมคนที่ 4 (ตัวเอง): ส่งเข้า POST /api/checkout เพื่อสร้าง Order, ตัด Stock และล้าง Cart ใน DB
  //    - เชื่อมคนที่ 3 (Cart): เรียก clearCart() ของน้องครีมเพื่อล้างตะกร้าฝั่ง Frontend เมื่อสั่งซื้อสำเร็จ
  //    - เชื่อมคนที่ 5 (Toast Notification): เรียก showToast("สั่งซื้อสำเร็จ!", "success")

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // 1. ตรวจสอบความถูกต้องของข้อมูลที่อยู่จัดส่ง
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^[0-9-]{9,12}$/.test(formData.phone.trim())) {
      newErrors.phone = "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง";
    }
    if (!formData.address.trim()) {
      newErrors.address = "กรุณากรอกที่อยู่จัดส่ง";
    }
    if (!formData.district.trim()) {
      newErrors.district = "กรุณากรอกอำเภอ/เขต";
    }
    if (!formData.province.trim()) {
      newErrors.province = "กรุณากรอกจังหวัด";
    }
    if (!formData.zipcode.trim()) {
      newErrors.zipcode = "กรุณากรอกรหัสไปรษณีย์";
    } else if (!/^\d{5}$/.test(formData.zipcode.trim())) {
      newErrors.zipcode = "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก";
    }

    // 2. ตรวจสอบข้อมูลบัตรเครดิตกรณีเลือกจ่ายด้วยบัตร
    if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
      if (!cardData.cardNumber) newErrors.cardNumber = "กรุณากรอกหมายเลขบัตร";
      if (!cardData.cardName) newErrors.cardName = "กรุณากรอกชื่อบนบัตร";
      if (!cardData.expiry) newErrors.expiry = "กรุณากรอกวันหมดอายุ";
      if (!cardData.cvc) newErrors.cvc = "กรุณากรอกรหัส CVC";
    }

    // หากมีช่องที่กรอกไม่ครบ ให้หยุดทำงานและโชว์ Error สีแดง
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    // 3. จัดกลุ่มข้อมูล Payload ตามมาตรฐาน OrderSchema
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
          productName: item.name || item.nameTh || item.productName || "ชุด Cooking Kit",
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
      payment: {
        method: paymentMethod, // 'PROMPTPAY' | 'CREDIT_CARD' | 'COD'
        cardDetails:
          paymentMethod === PAYMENT_METHODS.CREDIT_CARD
            ? {
                cardNumber: cardData.cardNumber.replace(/\s/g, ""),
                cardName: cardData.cardName,
                expiry: cardData.expiry,
              }
            : null,
      },
      pricing: {
        subtotal: itemsSubtotal,
        shippingFee: 60,
        grandTotal: grandTotal,
        earnedPoints: earnedPoints,
      },
      itemsSubtotal,
      shippingFee: 60,
      grandTotal,
      earnedPoints,
      createdAt: new Date().toISOString(),
    };

    console.log("🚀 Payload พร้อมส่งเข้า Backend POST /api/v1/checkout:", orderPayload);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/api/v1/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (handleClearCart) handleClearCart();
        navigate("/order-success", { state: { order: result.order || orderPayload } });
      } else {
        const err = await response.json();
        console.warn("⚠️ API แจ้งเตือนข้อผิดพลาด สลับไปบันทึกผ่าน State สำรอง:", err);
        if (handleClearCart) handleClearCart();
        navigate("/order-success", { state: { order: orderPayload } });
      }
    } catch (err) {
      console.warn("⚠️ เซิร์ฟเวอร์ออฟไลน์ สลับไปบันทึกผ่าน State สำรอง:", err);
      if (handleClearCart) handleClearCart();
      navigate("/order-success", { state: { order: orderPayload } });
    }
  };

  // กรณีไม่มีสินค้าในตะกร้า
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center text-[#2f2119]">
        <div className="w-24 h-24 bg-[#fcf8f2] border border-[#e8dfd1] rounded-full flex items-center justify-center text-[#8d593a] mb-4 shadow-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10" aria-hidden="true">
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

  // เรนเดอร์หน้าจอปกติเมื่อมีสินค้าในตะกร้า
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

        {/* ส่วนแสดงข้อมูลผู้ใช้และแต้มสะสม (เชื่อมคนที่ 5) */}
        <CheckoutUserStatus currentUser={currentUser} />

        {/* UI ส่วนเลือกรูปแบบการสั่งซื้อ ซื้อรายชุด (A La Carte) หรือ สมัครแพ็กเกจรายสัปดาห์ (Plan Selector) */}
        <div className="mb-8 bg-[#fcf8f2] border border-[#e8dfd1] rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#3d2c2e] mb-3 flex items-center gap-2">
            <span>📦</span> เลือกรูปแบบการสั่งซื้อ
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {/* ตัวเลือก A La Carte (ซื้อแยกรายชุดตามจริง) */}
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

            {/* ตัวเลือก Subscription Plans (S, M, L, XL) */}
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

        {/* ฟอร์มข้อมูลจัดส่งและสรุปรายการสั่งซื้อ */}
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
            />
          </div>
        </form>
      </div>
    </div>
  );
}
