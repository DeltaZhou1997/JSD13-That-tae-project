import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { users } from "../mock-data/users";
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

  // จุดเชื่อมต่อคนที่ 5: Core Infrastructure & Auth Context (คุณเน็ท)
  // -------------------------------------------------------------------------
  // 🔴 ปัจจุบัน: Mock User ID ไว้เป็น "USR-001" และดึงจาก mock-data/users.js
  // 🟢 ตอนรวมงานกับคนที่ 5 (ทำระบบ Login / Auth Context):
  //    - ลบ 2 บรรทัดนี้ออก แล้วเรียกใช้ Context เช่น:
  //      const { currentUser } = useAuth();
  //    - ตรวจสอบว่า currentUser มีฟิลด์ firstName, lastName, tierStatus, biaPoints ครบไหม

  const [currentUserId] = useState("USR-001");
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  // จุดเชื่อมต่อหน้าที่ตัวเอง - คนที่ 4: รูปแบบการสั่งซื้อ (Plan Selector)
  // -------------------------------------------------------------------------
  // 🟢 ค่าเริ่มต้น: ตั้งเป็น null เพื่อให้เปิดหน้าเว็บมาเป็นการซื้อแบบ "A La Carte (รายชุด)" ตามปกติ
  //    ไม่บล็อกปุ่มชำระเงินตั้งแต่แรกเปิดหน้า และคำนวณราคาตามรายการจริงในตะกร้า
  // 🟢 เมื่อผู้ใช้คลิกเลือกแพ็กเกจ (SIZE S/M/L/XL): ระบบจะเข้าสู่โหมดคำนวณโควต้า Subscription

  const [selectedPlan, setSelectedPlan] = useState(null);

  // 🟢 State สำหรับเก็บข้อความ Inline Error แจ้งเตือนสีแดงใต้ช่องกรอก
  const [errors, setErrors] = useState({});

  // จุดเชื่อมต่อคนที่ 3: Cart Management & State Operations (น้องครีม)
  // -------------------------------------------------------------------------
  // 🔴 ปัจจุบัน: ใช้ State จำลองรายการสินค้า 4 เมนู เพื่อให้เห็นภาพการคำนวณ
  // 🟢 ตอนรวมงานกับคนที่ 3 (ทำระบบ CartContext ใน React):
  //    - ลบ useState ก้อนนี้ออก แล้วดึง State ตะกร้าของน้องครีมมาใช้ เช่น:
  //      const { cartItems, clearCart } = useCart();
  //    - ตรวจสอบ format ของ Object สินค้าว่าใช้ key ชื่อ `id` หรือ `_id` ให้ตรงกัน
  // 🟢 หรือถ้าดึงจาก Backend ของตัวเอง (GET /api/cart/:user_id):
  //    - ปลดล็อกโค้ด useEffect ด้านล่างนี้เพื่อดึงข้อมูลตะกร้าจริงจาก MongoDB

  const [cartItems] = useState([
    {
      id: "PROD-001",
      name: "แกงส้มใต้ปลากะพงยอดยอดมะพร้าว",
      desc: "วัตถุดิบสดใหม่ + เครื่องแกงโฮมเมด",
      price: 220,
      quantity: 1,
    },
    {
      id: "PROD-002",
      name: "ลาบหมูคั่วเมืองเหนือ",
      desc: "พริกลาบมะแขว่นหอมๆ",
      price: 180,
      quantity: 1,
    },
    {
      id: "PROD-003",
      name: "แกงเขียวหวานไก่บ้าน",
      desc: "มะเขือเปราะกรอบ + พริกแกงสูตรโบราณ",
      price: 195,
      quantity: 1,
    },
    {
      id: "PROD-004",
      name: "ต้มข่าไก่เห็ดฟาง",
      desc: "รสชาติเข้มข้น หอมกะทิสด",
      price: 175,
      quantity: 1,
    },
  ]);

  /* 
  // 🟢 โค้ด ถ้าดึงข้อมูลตะกร้าผ่าน Backend API ของตัวเอง อาจจะต้องมีเปลี่ยน
  useEffect(() => {
    async function fetchCartData() {
      try {
        const response = await fetch(`/api/cart/${currentUserId}`);
        const data = await response.json();
        setCartItems(data.items || []);
      } catch (err) {
        console.error("ดึงข้อมูลตะกร้าไม่สำเร็จ:", err);
      }
    }
    if (currentUserId) fetchCartData();
  }, [currentUserId]);
  */

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
      items: cartItems.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
      })),
      shippingAddress: {
        recipientName: formData.fullName,
        phone: formData.phone,
        fullAddress: `${formData.address} เขต/อำเภอ${formData.district} จังหวัด${formData.province} ${formData.zipcode}`,
        deliveryDate: formData.deliveryDate,
      },
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
      createdAt: new Date().toISOString(),
    };

    console.log(
      "🚀 Payload พร้อมส่งเข้า Backend POST /api/checkout:",
      orderPayload,
    );

    // ปัจจุบัน: จำลองการย้ายไปหน้าสำเร็จทันที
    navigate("/order-success", { state: { order: orderPayload } });

    /* 
    // 🟢 โค้ดยิง API จริงลง MongoDB เมื่อรวมงาน
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = await response.json();
        
        // 1. ล้างตะกร้าของคนที่ 3: clearCart();
        // 2. เด้งแจ้งเตือนของคนที่ 5: showToast("สั่งซื้อสำเร็จแล้ว!", "success");
        // 3. พาไปหน้า OrderSuccess:
        navigate("/order-success", { state: { order: result.order } });
      } else {
        const err = await response.json();
        alert(err.message || "เกิดข้อผิดพลาดในการบันทึกคำสั่งซื้อ");
      }
    } catch (err) {
      console.error("ส่งคำสั่งซื้อไม่สำเร็จ:", err);
    }
    */
  };

  // จุดเชื่อมต่อคนที่ 2: กรณีไม่มีสินค้าในตะกร้า (Product Storefront)
  // -------------------------------------------------------------------------
  // 🔴 ปัจจุบัน: ปุ่มกดใช้ navigate("/") เพื่อพากลับหน้าแรก
  // 🟢 ตอนรวมงานกับคนที่ 2 (ทำหน้า Catalog & Storefront):
  //    - ถ้าหน้าร้านของคนที่ 2 ใช้ path อื่น เช่น "/catalog" หรือ "/menu" ให้เปลี่ยนตรงนี้
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center text-[#2f2119]">
        <div className="w-24 h-24 bg-[#fcf8f2] border border-[#e8dfd1] rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
          🛒
        </div>
        <h2 className="text-2xl font-bold text-[#3d2c2e] mb-2">
          ยังไม่มีสินค้าในตะกร้าของคุณ
        </h2>
        <p className="text-[#6f675f] text-sm max-w-md mb-8">
          เลือกชุดวัตถุดิบพร้อมปรุง (Cooking Kit)
          ที่คุณชื่นชอบลงตะกร้าก่อนดำเนินการชำระเงิน
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-[#3d2c2e] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#8d593a] transition-all shadow-md active:scale-95"
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
