import React, { useState, useEffect } from "react";
// 🟢 [อัปเดตใหม่] นำเข้า useNavigate เพื่อส่งผู้ใช้ไปหน้า OrderSuccess หลังสั่งซื้อ
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
  // 🟢 [อัปเดตใหม่] เรียกใช้งาน Hook สำหรับเปลี่ยนหน้า
  const navigate = useNavigate();

  // =========================================================================
  // 📌 [จุดที่จะต้องเปลี่ยน 1: ข้อมูลผู้ใช้ (Auth Context จากคุณเน็ท)]
  // -------------------------------------------------------------------------
  // 🔴 ปัจจุบัน: Mock User ID ไว้เป็น "USR-001" และดึงจาก mock-data
  // 🟢 ตอนรวมงานกับคุณเน็ท (ทำระบบ ล็อกอิน/สมาชิก):
  //    - ลบ 2 บรรทัดล่างนี้ออก แล้วดึง currentUser จาก Context ของระบบ เช่น:
  //      const { currentUser } = useAuth();
  // =========================================================================
  const [currentUserId] = useState("USR-001");
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const [selectedPlan] = useState(SUBSCRIPTION_PLANS.M);

  // =========================================================================
  // 📌 [จุดที่จะต้องเปลี่ยน 2: รายการสินค้าในตะกร้า (จากน้องครีม หรือ Backend)]
  // -------------------------------------------------------------------------
  // 🔴 ปัจจุบัน: ใช้ State จำลอง array ของสินค้า เพื่อให้หน้าตาเหมือน DB จริง
  // 🟢 ตอนรวมงานกับน้องครีม (Frontend ตะกร้าสินค้า):
  //    - เปลี่ยน useState ตรงนี้ไปเรียกใช้ CartContext ของน้องครีม เช่น:
  //      const { cartItems, clearCart } = useCart();
  // 🟢 ตอนรวมงานกับตัวเอง (Backend API ดึงข้อมูลตะกร้า):
  //    - ปลดล็อกโค้ด useEffect ข้างล่างนี้เพื่อให้ยิง API ไปเอาตะกร้าจริงจาก DB
  // =========================================================================
  const [cartItems, setCartItems] = useState([
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
  // 🟢 [ตัวอย่างโค้ดถ้าต้องดึงตะกร้าสินค้าจาก Backend (ตัวเองทำ)]
  useEffect(() => {
    async function fetchCartData() {
      try {
        const response = await fetch(`/api/cart/${currentUserId}`);
        const data = await response.json();
        setCartItems(data.items); // เอาข้อมูลสินค้าจริงจาก DB มาลง State
      } catch (err) {
        console.error("ดึงข้อมูลตะกร้าไม่สำเร็จ:", err);
      }
    }
    fetchCartData();
  }, [currentUserId]);
  */

  // -------------------------------------------------------------------------
  // State สำหรับจัดการฟอร์มที่อยู่ และ ข้อมูลบัตรเครดิต
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

  // -------------------------------------------------------------------------
  // ส่วนคำนวณราคาและสร้าง QR Code
  // -------------------------------------------------------------------------
  const itemsSubtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const earnedPoints = calculateEarnedPoints(itemsSubtotal);
  const grandTotal = calculateGrandTotal(itemsSubtotal);
  const promptPayQrUrl = generatePromptPayQrUrl("0812345678", grandTotal); // ตรงนี้ใส่เบอร์โทรจริงหรืออ เลขประชาชนจริงที่เชื่อมกับพร้อมเพย์ได้เลย

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  // =========================================================================
  // 📌 [จุดที่จะต้องเปลี่ยน 3: การกดส่งข้อมูลสั่งซื้อและการเด้งไปหน้า OrderSuccess]
  // -------------------------------------------------------------------------
  // 🔴 ปัจจุบัน: สุ่ม orderId ชั่วคราว และพาผู้ใช้เด้งไปหน้า /order-success ทันที
  // 🟢 ตอนรวมงานกับตัวเอง (Backend Admin & Order API):
  //    - ปลดล็อกโค้ด fetch() ข้างล่าง เพื่อส่งข้อมูลไปบันทึกใน Database จริงๆ ก่อน
  //    - เมื่อบันทึกสำเร็จ (response.ok) ค่อยพาเด้งไปหน้า /order-success
  // =========================================================================
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    // 1. ตรวจสอบว่ากรอกข้อมูลที่อยู่ครบถ้วนหรือไม่
    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      alert("กรุณากรอกข้อมูลชื่อ เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วน");
      return;
    }

    // 2. ถ้าเลือกชำระด้วยบัตรเครดิต ต้องตรวจสอบข้อมูลบัตรด้วย
    if (paymentMethod === PAYMENT_METHODS.CREDIT_CARD) {
      if (
        !cardData.cardNumber ||
        !cardData.cardName ||
        !cardData.expiry ||
        !cardData.cvc
      ) {
        alert("กรุณากรอกข้อมูลบัตรเครดิตให้ครบถ้วน");
        return;
      }
    }

    // 3. จัดกลุ่มข้อมูล (Payload) ตามมาตรฐานที่จะส่งให้ Backend
    const orderPayload = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`, // สุ่ม ID จำลองขึ้นมาก่อน
      userId: currentUserId,
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
        method: paymentMethod, // ค่าที่เป็นไปได้: 'PROMPTPAY' | 'CREDIT_CARD' | 'COD'
        cardDetails:
          paymentMethod === PAYMENT_METHODS.CREDIT_CARD
            ? {
                cardNumber: cardData.cardNumber.replace(/\s/g, ""), // ตัดช่องว่างออก
                cardName: cardData.cardName,
                expiry: cardData.expiry,
              }
            : null,
      },
      pricing: {
        subtotal: itemsSubtotal,
        shippingFee: 65,
        grandTotal: grandTotal,
        earnedPoints: earnedPoints,
      },
      createdAt: new Date().toISOString(),
    };

    console.log("🚀 Payload พร้อมส่งให้ Backend (ตัวเองทำ):", orderPayload);

    // 🟢 [อัปเดตใหม่] ทำงานแบบจำลองก่อน (เปลี่ยนจากการ alert() เป็นพาเด้งไปหน้า OrderSuccess)
    // พาผู้ใช้ย้ายไปหน้า /order-success พร้อมส่งข้อมูล orderPayload ไปด้วยผ่าน state
    navigate("/order-success", { state: { order: orderPayload } });

    /* 
    // 🟢 [ตัวอย่างโค้ดที่จะต้องปลดล็อกเมื่อทำ Backend ยิง API จริง]
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const result = await response.json();
        
        // 📌 [ขั้นตอนที่ต้องทำหลังยิง API สำเร็จ]
        // 1. ล้างสินค้าในตะกร้าออก (ถ้ามี CartContext ของน้องครีม): clearCart();
        // 2. เด้งไปหน้าสำเร็จโดยใช้ orderId จริงจาก DB:
        navigate("/order-success", { state: { order: result } });
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลคำสั่งซื้อ กรุณาลองใหม่อีกครั้ง");
      }
    } catch (err) {
      console.error("ส่งคำสั่งซื้อไม่สำเร็จ:", err);
    }
    */
  };

  // =========================================================================
  // 📌 [จุดที่จะต้องเปลี่ยน 4: กรณีไม่มีสินค้าในตะกร้า (Empty Cart Handling)]
  // -------------------------------------------------------------------------
  // 🔴 ปัจจุบัน: ปุ่มกดใช้ navigate("/") เพื่อย้ายไปหน้าหลัก
  // 🟢 ตอนรวมงานกับเพื่อนที่มี Routing:
  //    - ถ้าหน้าเมนูอาหารของเพื่อนใช้เส้นทางอื่น เช่น "/menu" ให้เปลี่ยนตรง navigate()
  // =========================================================================
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
          onClick={() => navigate("/")} // 🟢 [อัปเดตใหม่] ใช้ navigate แทน window.location.href
          className="bg-[#3d2c2e] text-white px-8 py-3.5 rounded-full font-bold hover:bg-[#8d593a] transition-all shadow-md active:scale-95"
        >
          กลับไปเลือกเมนูอาหาร
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // เรนเดอร์หน้าจอปกติเมื่อมีสินค้าในตะกร้า
  // -------------------------------------------------------------------------
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
            />
          </div>
        </form>
      </div>
    </div>
  );
}
