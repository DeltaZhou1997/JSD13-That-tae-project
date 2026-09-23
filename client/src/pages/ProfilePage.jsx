// client/src/pages/ProfilePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";
import defaultAvatar from "../assets/default-avatar.svg";
import { getUserElement, ELEMENT_TH_TO_EN } from "../utils/quizHelpers.js";
import { getAuthHeaders, getApiUrl } from "../utils/authHeader.js";
import { THAI_PROVINCES } from "../constants/thaiProvinces";

// =========================================================================
// 🌟 SVGs & Visual Icons (User-friendly & Premium)
// =========================================================================
function ElementIcon({ element, className = "w-5 h-5" }) {
  if (element === "ดิน" || element === "earth") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    );
  }
  if (element === "น้ำ" || element === "water") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      </svg>
    );
  }
  if (element === "ลม" || element === "air" || element === "wind") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    );
  }
  if (element === "ไฟ" || element === "fire") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function PhoneIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function BloodIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function MapPinIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TruckIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-5l-3-4h-5v10" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

function CoinIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10" />
      <path d="M15 9.5a3 3 0 0 0-6 0c0 3 6 2 6 5a3 3 0 0 1-6 0" />
    </svg>
  );
}

function SparklesIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
    </svg>
  );
}

function EditPencilIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function CloseIcon({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function OrderHistoryIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function DiceIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="3" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.5" fill="currentColor" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.5" fill="currentColor" />
    </svg>
  );
}

function LeafIcon({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

// ข้อมูลธีมและคำแนะนำสำหรับแต่ละธาตุ
const ELEMENT_DETAILS = {
  ดิน: {
    name: "ธาตุดิน",
    colorBadge: "bg-amber-600 text-white",
    cardBg: "from-amber-500/10 via-amber-100/30 to-white border-amber-200",
    accentText: "text-amber-800",
    quote: "หนักแน่น มั่นคง • ย่อยอาหารช้า • ต้องการรสชาติช่วยกระตุ้นการเผาผลาญ",
    suitableFlavors: "รสฝาด หวาน มัน เค็ม",
    herbs: "ฟักทอง, เผือก, ถั่ว, ดอกแค, ผักหวานป่า",
    warning: "ระวังระบบเผาผลาญเฉื่อยชา หลีกเลี่ยงของมันของทอดปริมาณมากเกินไป",
    lifestyle: "ควรออกกำลังกายอย่างสม่ำเสมอ ดื่มน้ำอุ่นในตอนเช้าเพื่อปลุกระบบย่อย",
  },
  น้ำ: {
    name: "ธาตุน้ำ",
    colorBadge: "bg-sky-600 text-white",
    cardBg: "from-sky-500/10 via-sky-100/30 to-white border-sky-200",
    accentText: "text-sky-800",
    quote: "อ่อนโยน ปรับตัวเก่ง • ร่างกายชุ่มชื้น • เสมหะกำเริบได้ง่ายในหน้าฝน/หนาว",
    suitableFlavors: "รสเปรี้ยว ขม เมาเบื่อ",
    herbs: "มะนาว, ส้ม, มะขามป้อม, มะกรูด, มะเขือเทศ",
    warning: "ระวังอาการหวัดคัดจมูก และบวมน้ำ หลีกเลี่ยงอาหารเค็มจัดและของหวานจัด",
    lifestyle: "ควรดื่มน้ำอุณหภูมิห้อง พักผ่อนให้ตรงเวลา และรักษาความอบอุ่นให้ร่างกาย",
  },
  ลม: {
    name: "ธาตุลม",
    colorBadge: "bg-emerald-600 text-white",
    cardBg: "from-emerald-500/10 via-emerald-100/30 to-white border-emerald-200",
    accentText: "text-emerald-800",
    quote: "คล่องแคล่ว ว่องไว • ร่างกายไวต่อการเปลี่ยนแปลง • ท้องอืดท้องเฟ้อง่าย",
    suitableFlavors: "รสเผ็ดร้อน ขับลม สุขุม",
    herbs: "ขิง, ข่า, ตะไคร้, กะเพรา, พริกไทยดำ, โหระพา",
    warning: "ระวังแก๊สในกระเพาะอาหาร ทานอาหารให้ตรงเวลา ไม่ควรปล่อยให้ท้องว่างนาน",
    lifestyle: "ฝึกหายใจลึกๆ รับประทานอาหารปรุงสุกใหม่ร้อนๆ ช่วยกระจายลมในเส้นเลือด",
  },
  ไฟ: {
    name: "ธาตุไฟ",
    colorBadge: "bg-rose-600 text-white",
    cardBg: "from-rose-500/10 via-rose-100/30 to-white border-rose-200",
    accentText: "text-rose-800",
    quote: "กระตือรือร้น เปี่ยมพลัง • เผาผลาญดีเลิศ • ร้อนในและหงุดหงิดง่ายเมื่อเจอแดด",
    suitableFlavors: "รสขม เย็น จืด หวานน้อย",
    herbs: "ใบบัวบก, มะระ, แตงกวา, เก๊กฮวย, ตำลึง, บวบ",
    warning: "ระวังอาการร้อนใน กรดไหลย้อน และสิว หลีกเลี่ยงอาหารเผ็ดจัด แอลกอฮอล์",
    lifestyle: "ดื่มน้ำสมุนไพรฤทธิ์เย็น เลี่ยงที่อากาศร้อนจัด และฝึกผ่อนคลายจิตใจ",
  },
};

export default function ProfilePage() {
  const { currentUser, updateUser } = useAuth();
  const toast = useToast();
  const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");

  const userElement = getUserElement(currentUser);
  const elementEn = userElement ? ELEMENT_TH_TO_EN[userElement] : null;
  const elementInfo = userElement ? ELEMENT_DETAILS[userElement] : null;

  // State ฟอร์มแก้ไขข้อมูล
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    bloodType: currentUser?.bloodType || "O",
    gender: currentUser?.gender || "female",
    street: currentUser?.deliveryAddress?.street || "",
    subdistrict: currentUser?.deliveryAddress?.subdistrict || "",
    district: currentUser?.deliveryAddress?.district || "",
    province: currentUser?.deliveryAddress?.province || "",
    postalCode: currentUser?.deliveryAddress?.postalCode || "",
  });

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isDraggingAvatar, setIsDraggingAvatar] = useState(false);
  const [addressBook, setAddressBook] = useState(currentUser?.addresses || []);
  const [addressModal, setAddressModal] = useState(null);
  const [addressSaving, setAddressSaving] = useState(false);
  const emptyAddress = { label: "บ้าน", address: "", subdistrict: "", district: "", province: "", zipcode: "", phone: currentUser?.phone || "" };
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const avatarInputRef = useRef(null);

  // อัปโหลดรูปภาพโปรไฟล์ขึ้น MongoDB GridFS (v2)
  const handleAvatarUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, WebP)");
      return;
    }

    const userId = currentUser.id || currentUser._id;
    const uploadData = new FormData();
    uploadData.append("image", file);

    setIsUploadingAvatar(true);
    try {
      const res = await fetch(`${apiUrl}/api/v2/images/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: uploadData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const fullAvatarUrl = data.url.startsWith("http") ? data.url : `${apiUrl}${data.url}`;
        // บันทึกลง User model ใน MongoDB ทันที
        const updateRes = await fetch(`${apiUrl}/api/v2/users/${userId}`, {
          method: "PUT",
          headers: getAuthHeaders({ "Content-Type": "application/json" }),
          body: JSON.stringify({ avatar: fullAvatarUrl }),
        });
        if (updateRes.ok) {
          const updatedUserData = await updateRes.json();
          updateUser(updatedUserData.user || { ...currentUser, avatar: fullAvatarUrl });
          toast.success("อัปเดตรูปโปรไฟล์สำเร็จเรียบร้อย! 📸✨");
        } else {
          updateUser({ ...currentUser, avatar: fullAvatarUrl });
          toast.success("อัปเดตรูปโปรไฟล์ชั่วคราวเรียบร้อย ✨");
        }
      } else {
        toast.error(data.message || "อัปโหลดรูปภาพไม่สำเร็จ");
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
      toast.error("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        bloodType: currentUser.bloodType || "O",
        gender: currentUser.gender || "female",
        street: currentUser.deliveryAddress?.street || "",
        subdistrict: currentUser.deliveryAddress?.subdistrict || "",
        district: currentUser.deliveryAddress?.district || "",
        province: currentUser.deliveryAddress?.province || "",
        postalCode: currentUser.deliveryAddress?.postalCode || "",
      });
    }
  }, [currentUser]);

  useEffect(() => setAddressBook(currentUser?.addresses || []), [currentUser?.addresses]);

  const saveBookAddress = async (event) => {
    event.preventDefault();
    setAddressSaving(true);
    const isEdit = addressModal !== "new";
    const endpoint = isEdit ? `${apiUrl}/api/v2/users/me/addresses/${addressModal._id}` : `${apiUrl}/api/v2/users/me/addresses`;
    try {
      const res = await fetch(endpoint, { method: isEdit ? "PUT" : "POST", headers: getAuthHeaders({ "Content-Type": "application/json" }), body: JSON.stringify({ ...addressForm, isDefault: addressForm.isDefault || addressBook.length === 0 }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "บันทึกที่อยู่ไม่สำเร็จ");
      setAddressBook(data.addresses || []);
      updateUser({ addresses: data.addresses || [] });
      setAddressModal(null);
      toast.success("บันทึกที่อยู่เรียบร้อยแล้ว");
    } catch (error) { toast.error(error.message); }
    finally { setAddressSaving(false); }
  };

  const deleteBookAddress = async (id) => {
    if (!window.confirm("ต้องการลบที่อยู่นี้ใช่ไหม?")) return;
    const res = await fetch(`${apiUrl}/api/v2/users/me/addresses/${id}`, { method: "DELETE", headers: getAuthHeaders() });
    const data = await res.json();
    if (res.ok) { setAddressBook(data.addresses || []); updateUser({ addresses: data.addresses || [] }); toast.success("ลบที่อยู่แล้ว"); }
    else toast.error(data.message || "ลบที่อยู่ไม่สำเร็จ");
  };

  const setDefaultBookAddress = async (item) => {
    const res = await fetch(`${apiUrl}/api/v2/users/me/addresses/${item._id}`, { method: "PUT", headers: getAuthHeaders({ "Content-Type": "application/json" }), body: JSON.stringify({ isDefault: true }) });
    const data = await res.json();
    if (res.ok) { setAddressBook(data.addresses || []); updateUser({ addresses: data.addresses || [] }); toast.success("ตั้งเป็นที่อยู่หลักแล้ว"); }
    else toast.error(data.message || "ตั้งค่าที่อยู่หลักไม่สำเร็จ");
  };

  // ปิด modal เมื่อกดปุ่ม Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isConfirmOpen) {
          setIsConfirmOpen(false);
        } else if (isEditModalOpen) {
          setIsEditModalOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEditModalOpen, isConfirmOpen]);

  if (!currentUser) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] flex flex-col items-center justify-center p-6 text-center text-[#2F2119]">
        <div className="w-20 h-20 bg-[#F6EDE5] rounded-full flex items-center justify-center text-[#8D593A] mb-4 shadow-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-9 h-9" aria-hidden="true">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-[#3D2C2E] mb-2">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-[#6F675F] text-sm max-w-md mb-6">
          เข้าสู่ระบบเพื่อจัดการข้อมูลส่วนตัว ตรวจสอบธาตุเจ้าเรือน และประวัติการสั่งซื้อ
        </p>
        <Link
          to="/login"
          className="bg-[#4C1F08] text-white px-8 py-3 rounded-full font-bold hover:bg-[#6B3215] transition-all shadow-md"
        >
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ขั้นตอนที่ 1: ตรวจสอบความถูกต้องและเปิดหน้าต่างยืนยัน (Confirm Dialog)
  const handlePreSave = (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error("กรุณากรอกชื่อและนามสกุลให้ครบถ้วน");
      return;
    }
    setIsConfirmOpen(true);
  };

  // ขั้นตอนที่ 2: บันทึกข้อมูลจริงหลังได้รับการยืนยัน
  const handleConfirmedSave = async () => {
    setSaving(true);
    const userId = currentUser.id || currentUser._id;
    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      ...(currentUser.role !== "admin" && {
        bloodType: formData.bloodType,
        gender: formData.gender,
      }),
      deliveryAddress: {
        street: formData.street.trim(),
        subdistrict: formData.subdistrict.trim(),
        district: formData.district.trim(),
        province: formData.province.trim(),
        postalCode: formData.postalCode.trim(),
      },
    };

    try {
      const res = await fetch(`${apiUrl}/api/v2/users/${userId}`, {
        method: "PUT",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "บันทึกข้อมูลไม่สำเร็จ");
      }

      const updated = await res.json();
      if (updateUser) {
        updateUser(updated.user || { ...currentUser, ...payload });
      }
      toast.success("บันทึกการเปลี่ยนแปลงข้อมูลโปรไฟล์เรียบร้อยแล้ว ✨");
      setIsConfirmOpen(false);
      setIsEditModalOpen(false);
    } catch (err) {
      console.warn("บันทึกลงเซิร์ฟเวอร์ไม่สำเร็จ ทำการอัปเดต Local State แทน:", err.message);
      if (updateUser) {
        updateUser({ ...currentUser, ...payload });
      }
      toast.success("บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว ✨");
      setIsConfirmOpen(false);
      setIsEditModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = currentUser.role === "admin";
  const tier = currentUser.tierStatus || "Bronze";
  const points = currentUser.biaPoints ?? currentUser.points ?? 0;
  const memberId = currentUser.id ? `TT-${String(currentUser.id).replace(/\D/g, "").slice(-6) || "8829"}` : "TT-202604";

  // คำนวณแต้มสำหรับระดับสิทธิพิเศษถัดไป
  const tierProgress = tier === "Bronze" ? Math.min(100, Math.round((points / 500) * 100))
    : tier === "Silver" ? Math.min(100, Math.round((points / 1500) * 100))
      : tier === "Gold" ? Math.min(100, Math.round((points / 3000) * 100))
        : 100;

  const nextTierName = tier === "Bronze" ? "Silver" : tier === "Silver" ? "Gold" : tier === "Gold" ? "Platinum" : "สูงสุดแล้ว";

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-10 px-4 sm:px-6 lg:px-8 text-[#2F2119]">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ===================================================================== */}
        {/* 🌟 Header Section: Profile Banner & Quick Actions                     */}
        {/* ===================================================================== */}
        <div className="bg-white border border-[#E8DFD1] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle Decorative Background Blob */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8D593A]/5 via-amber-50/20 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* รูปโปรไฟล์ พร้อมปุ่มอัปโหลดรูปภาพ / Drag & Drop */}
              <div
                className="relative shrink-0 group cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingAvatar(true); }}
                onDragLeave={() => setIsDraggingAvatar(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDraggingAvatar(false);
                  const file = e.dataTransfer?.files?.[0];
                  if (file) handleAvatarUpload(file);
                }}
                title="คลิกหรือลากรูปมาวางเพื่อเปลี่ยนรูปโปรไฟล์ (บันทึกลง MongoDB)"
              >
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                  }}
                  className="hidden"
                />
                <img
                  src={currentUser.avatar || defaultAvatar}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = defaultAvatar; }}
                  alt="Avatar"
                  className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-md ring-2 transition-all ${
                    isDraggingAvatar ? "ring-[#8D593A] scale-105" : "ring-[#EAE2D5] group-hover:ring-[#8D593A]"
                  }`}
                />
                {isUploadingAvatar ? (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-[10px] font-bold">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mb-1" />
                    <span>กำลังอัปโหลด...</span>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 mb-0.5">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span>เปลี่ยนรูป</span>
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 bg-[#8D593A] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 z-10">
                  <SparklesIcon className="w-3 h-3 text-amber-300" />
                  {isAdmin ? "Admin" : tier}
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black text-[#3D2E2B]">
                    {currentUser.firstName} {currentUser.lastName}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE2D5] text-[#8D593A]">
                    <ShieldCheckIcon className="w-3.5 h-3.5" />
                    {isAdmin ? "ผู้ดูแลระบบ (Admin)" : `สมาชิก ${tier}`}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#7A6B63] mt-1 flex items-center gap-2">
                  <span>{currentUser.email}</span>
                  <span className="text-[#D4C5B0]">•</span>
                  <span className="font-mono text-xs font-semibold text-[#8D593A]">รหัส: {memberId}</span>
                </p>

                {/* ส่วนแสดงคะแนนและระดับสมาชิก อยู่กับข้อมูลคน (User Header) */}
                {!isAdmin && (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200/80 shadow-2xs">
                      <CoinIcon className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-xs font-bold text-[#8D593A]">{points}</span>
                      <span className="text-[10px] text-[#A09289]">เบี้ย</span>
                    </div>

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#EAE2D5] text-xs">
                      <span className="text-[11px] text-[#7A6B63] font-medium">ระดับ: <strong className="text-[#3D2E2B] font-bold">{tier}</strong></span>
                      <div className="w-16 bg-[#EAE2D5] h-1.5 rounded-full overflow-hidden inline-block align-middle">
                        <div
                          className="bg-gradient-to-r from-[#8D593A] to-amber-500 h-full rounded-full"
                          style={{ width: `${tierProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-[#8D593A] font-bold">{tierProgress}%</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 mt-2 text-xs text-[#7A6B63]">
                  <span className="flex items-center gap-1">
                    <PhoneIcon className="w-3.5 h-3.5 text-[#8D593A]" />
                    {currentUser.phone || "ยังไม่ได้ระบุเบอร์"}
                  </span>
                  {!isAdmin && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <BloodIcon className="w-3.5 h-3.5 text-rose-500" />
                        กรุ๊ป {currentUser.bloodType || "O"}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
              {/* ปุ่มเปิด Modal แก้ไขข้อมูลส่วนตัว */}
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#4C1F08] hover:bg-[#6B3215] text-white text-xs font-bold transition shadow-sm inline-flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <EditPencilIcon className="w-3.5 h-3.5" />
                <span>แก้ไขข้อมูลส่วนตัว</span>
              </button>

              {!isAdmin ? (
                <Link
                  to="/orders"
                  className="px-4 py-2.5 rounded-full border border-[#D4C5B0] bg-white hover:border-[#8D593A] text-[#4A3228] text-xs font-bold transition shadow-2xs inline-flex items-center gap-1.5"
                >
                  <OrderHistoryIcon className="w-3.5 h-3.5 text-[#8D593A]" />
                  <span>ประวัติคำสั่งซื้อ</span>
                </Link>
              ) : (
                <Link
                  to="/admin/dashboard"
                  className="px-4 py-2.5 rounded-full border border-[#D4C5B0] bg-white hover:border-[#8D593A] text-[#4A3228] text-xs font-bold transition shadow-2xs inline-flex items-center gap-1.5"
                >
                  <span>แดชบอร์ดผู้ดูแล &rarr;</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 🌟 2-Column Responsive Balanced Grid                                  */}
        {/* ===================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* =================================================================== */}
          {/* 🌟 Column 1 (Left 6 Cols): ธาตุเจ้าเรือน & โภชนาการส่วนบุคคล        */}
          {/* =================================================================== */}
          <div className="lg:col-span-6 space-y-6">

            {/* Card 1.1: ธาตุเจ้าเรือนประจำตัว (Body Element Showcase) */}
            <div className="bg-white border border-[#E8DFD1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#EAE2D5] flex items-center justify-center text-[#8D593A]">
                    <LeafIcon className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-black text-[#3D2E2B]">ธาตุเจ้าเรือนประจำตัว</h2>
                </div>

                <Link
                  to="/element-quiz"
                  className="text-xs font-bold text-[#8D593A] hover:text-[#6B3215] transition inline-flex items-center gap-1"
                >
                  <span>{userElement ? "ทำแบบทดสอบใหม่" : "ทำแบบทดสอบ"}</span>
                  <span>&rarr;</span>
                </Link>
              </div>

              {userElement && elementInfo ? (
                <div className={`rounded-2xl border p-4 bg-gradient-to-b ${elementInfo.cardBg} space-y-3`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${elementInfo.colorBadge} shadow-sm ring-2 ring-white shrink-0`}>
                        <ElementIcon element={userElement} className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <strong className="text-lg font-black text-[#3D2E2B]">{elementInfo.name}</strong>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${elementInfo.colorBadge}`}>
                            ธาตุหลัก
                          </span>
                        </div>
                        <span className="text-[11px] text-[#7A6B63] font-medium">สมดุลร่างกายเฉพาะตัวคุณ</span>
                      </div>
                    </div>

                    <Link
                      to={`/menus?element=${elementEn || userElement}`}
                      className="px-3 py-1 bg-white hover:bg-[#FAF8F5] text-xs font-bold rounded-full border border-[#D4C5B0] text-[#3D2E2B] shadow-2xs transition inline-flex items-center gap-1 shrink-0"
                    >
                      <span>เมนูธาตุนี้ &rarr;</span>
                    </Link>
                  </div>

                  <p className="text-xs text-[#4A3228] bg-white/70 px-3 py-2 rounded-xl border border-white/80 line-clamp-2">
                    "{elementInfo.quote}"
                  </p>

                  <div className="grid text-xs">
                    <div className="p-2.5 bg-white/80 rounded-xl border border-[#EAE2D5]/80">
                      <span className="block text-[10px] font-bold text-[#8D593A] mb-0.5">รสชาติปรับสมดุล</span>
                      <span className="font-semibold text-[#3D2E2B] text-xs truncate block">{elementInfo.suitableFlavors}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-[#D4C5B0] bg-[#FAF8F5] text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#EFE9E1] flex items-center justify-center text-[#8D593A]">
                    <ElementIcon element="unknown" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#3D2E2B]">ยังไม่ทราบธาตุเจ้าเรือนประจำตัว</h3>
                    <p className="text-xs text-[#7A6B63] max-w-sm mx-auto mt-1">
                      ทำแบบทดสอบเพียง 5 ข้อ เพื่อค้นหาธาตุตามศาสตร์แผนไทยและรับคำแนะนำเมนูอาหารปรับสมดุล
                    </p>
                  </div>
                  <Link
                    to="/element-quiz"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8D593A] text-white text-xs font-bold hover:bg-[#72462C] transition shadow-xs"
                  >
                    <span>เริ่มทำแบบทดสอบ</span>
                    <span>&rarr;</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Card 1.2: คำแนะนำโภชนาการและไลฟ์สไตล์ (Personalized Tips) */}
            {userElement && elementInfo && (
              <div className="bg-white border border-[#E8DFD1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#F2ECE4] pb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <SparklesIcon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-[#3D2E2B]">เคล็ดลับดูแลสุขภาพประจำ{elementInfo.name}</h3>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5]/70">
                    <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ⚠️
                    </div>
                    <div>
                      <strong className="block font-bold text-[#3D2E2B] mb-0.5">ข้อควรระวังสำหรับคุณ</strong>
                      <p className="text-[#63534B] leading-relaxed">{elementInfo.warning}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5]/70">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <div>
                      <strong className="block font-bold text-[#3D2E2B] mb-0.5">ไลฟ์สไตล์ที่ช่วยเพิ่มพลัง</strong>
                      <p className="text-[#63534B] leading-relaxed">{elementInfo.lifestyle}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =================================================================== */}
          {/* 🌟 Column 2 (Right 6 Cols): ข้อมูลติดต่อ ที่อยู่ & สิทธิประโยชน์     */}
          {/* =================================================================== */}
          <div className="lg:col-span-6 space-y-6">

            {/* Card 2.1: ข้อมูลติดต่อและที่อยู่จัดส่ง (Contact & Shipping Address) */}
            <div className="bg-white border border-[#E8DFD1] rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F2ECE4] pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#FAF7F2] border border-[#EAE2D5] flex items-center justify-center text-[#8D593A]">
                    <TruckIcon className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-black text-[#3D2E2B]">ข้อมูลติดต่อและที่อยู่จัดส่ง</h2>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(true)}
                  className="text-xs font-bold text-[#8D593A] hover:text-[#6B3215] transition inline-flex items-center gap-1 cursor-pointer"
                >
                  <EditPencilIcon className="w-3.5 h-3.5" />
                  <span>แก้ไขข้อมูล</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5]/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7A6B63] mb-1">
                    <PhoneIcon className="w-3 h-3 text-[#8D593A]" />
                    <span>เบอร์โทรศัพท์</span>
                  </div>
                  <span className="font-bold text-[#3D2E2B] text-sm">
                    {currentUser.phone || "ยังไม่ได้ระบุเบอร์โทร"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5]/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7A6B63] mb-1">
                    <MailIcon className="w-3 h-3 text-[#8D593A]" />
                    <span>อีเมล</span>
                  </div>
                  <span className="font-bold text-[#3D2E2B] text-sm truncate block">
                    {currentUser.email}
                  </span>
                </div>

                {!isAdmin && (
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5]/80">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7A6B63] mb-1">
                      <BloodIcon className="w-3 h-3 text-rose-500" />
                      <span>กรุ๊ปเลือด</span>
                    </div>
                    <span className="font-bold text-[#3D2E2B] text-sm">
                      {currentUser.bloodType || "O"}
                    </span>
                  </div>
                )}

                <div className={`p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5]/80 ${isAdmin ? "sm:col-span-2" : ""}`}>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7A6B63] mb-1">
                    <ShieldCheckIcon className="w-3 h-3 text-[#8D593A]" />
                    <span>บทบาทในระบบ</span>
                  </div>
                  <span className="font-bold text-[#3D2E2B] text-sm">
                    {isAdmin ? "ผู้ดูแลระบบ (Admin)" : "สมาชิกทั่วไป (Customer)"}
                  </span>
                </div>

                <div className="sm:col-span-2 p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5]/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7A6B63]">
                      <MapPinIcon className="w-3.5 h-3.5 text-[#8D593A]" />
                      <span>{isAdmin ? "ที่อยู่สำนักงาน / ร้านค้า" : "ที่อยู่จัดส่งหลัก (Default)"}</span>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#8D593A]/10 text-[#8D593A]">
                      พร้อมจัดส่ง
                    </span>
                  </div>
                  <p className="font-medium text-[#3D2E2B] text-xs sm:text-sm leading-relaxed pt-1">
                    {formData.street
                      ? `${formData.street} ${formData.district} ${formData.province} ${formData.postalCode}`
                      : "ยังไม่ได้เพิ่มที่อยู่จัดส่ง"}
                  </p>
                </div>
              </div>
            </div>

            {/* Address book */}
            {!isAdmin && <div className="bg-white border border-[#E8DFD1] rounded-3xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div><h2 className="text-base font-black text-[#3D2E2B]">สมุดที่อยู่จัดส่ง</h2><p className="text-xs text-[#7A6B63] mt-1">บันทึกได้หลายที่อยู่ และเลือกใช้ตอนชำระเงิน</p></div>
                <button type="button" onClick={() => { setAddressForm({ ...emptyAddress, phone: currentUser.phone || "" }); setAddressModal("new"); }} className="rounded-full bg-[#4C1F08] px-3 py-2 text-xs font-bold text-white">+ เพิ่มที่อยู่</button>
              </div>
              <div className="space-y-3">
                {addressBook.length === 0 && <p className="rounded-2xl bg-[#FAF8F5] p-4 text-center text-xs text-[#7A6B63]">ยังไม่มีที่อยู่หลายรายการ</p>}
                {addressBook.map((item) => <div key={item._id} className="rounded-2xl border border-[#EAE2D5] bg-[#FAF8F5] p-4">
                  <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2"><strong className="text-sm text-[#3D2E2B]">{item.label}</strong>{item.isDefault && <span className="rounded-full bg-[#8D593A]/10 px-2 py-0.5 text-[10px] font-bold text-[#8D593A]">ที่อยู่หลัก</span>}</div><p className="mt-1 text-xs leading-5 text-[#63534B]">{item.address} ต.{item.subdistrict} อ.{item.district} จ.{item.province} {item.zipcode}<br />โทร. {item.phone}</p></div><div className="flex shrink-0 gap-2 text-[11px] font-bold"><button type="button" onClick={() => { setAddressForm({ ...item }); setAddressModal(item); }} className="text-[#8D593A]">แก้ไข</button><button type="button" onClick={() => deleteBookAddress(item._id)} className="text-rose-600">ลบ</button></div></div>
                  {!item.isDefault && <button type="button" onClick={() => setDefaultBookAddress(item)} className="mt-3 text-[11px] font-bold text-[#8D593A] underline">ตั้งเป็นที่อยู่หลัก</button>}
                </div>)}
              </div>
            </div>}


            {/* Card 2.3: ทางลัดกิจกรรม (Quick Action Shortcuts) */}
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/menu-randomizer"
                className="p-4 rounded-2xl bg-white border border-[#E8DFD1] hover:border-[#8D593A] transition-all shadow-2xs group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 group-hover:bg-[#8D593A] group-hover:text-white text-[#8D593A] flex items-center justify-center transition">
                  <DiceIcon className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-xs font-black text-[#3D2E2B] block">สุ่มเมนู 4 ภาค</strong>
                  <span className="text-[10px] text-[#7A6B63]">คิดไม่ออกให้เราช่วยเลือก</span>
                </div>
              </Link>

              <Link
                to="/menus"
                className="p-4 rounded-2xl bg-white border border-[#E8DFD1] hover:border-[#8D593A] transition-all shadow-2xs group flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-700 group-hover:text-white text-emerald-700 flex items-center justify-center transition">
                  <LeafIcon className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-xs font-black text-[#3D2E2B] block">สำรวจเมนูทั้งหมด</strong>
                  <span className="text-[10px] text-[#7A6B63]">วัตถุดิบสดพร้อมปรุง</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {addressModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !addressSaving && setAddressModal(null)}><form onSubmit={saveBookAddress} onClick={(e) => e.stopPropagation()} className="w-full max-w-xl space-y-4 rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="text-lg font-black text-[#3D2E2B]">{addressModal === "new" ? "เพิ่มที่อยู่ใหม่" : "แก้ไขที่อยู่"}</h2><button type="button" onClick={() => setAddressModal(null)}>✕</button></div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{[["label","ชื่อที่อยู่ เช่น บ้าน / ที่ทำงาน"],["phone","เบอร์โทรศัพท์"],["address","บ้านเลขที่ อาคาร ถนน ซอย"],["subdistrict","ตำบล / แขวง"],["district","อำเภอ / เขต"],["province","จังหวัด"],["zipcode","รหัสไปรษณีย์"]].map(([name, label]) => <label key={name} className={name === "address" ? "sm:col-span-2 text-xs font-bold text-[#7A6B63]" : "text-xs font-bold text-[#7A6B63]"}>{label}<input required value={addressForm[name] || ""} onChange={(e) => setAddressForm((prev) => ({ ...prev, [name]: e.target.value }))} className="mt-1 w-full rounded-xl border border-[#E8DFD1] bg-[#FAF8F5] px-3 py-2 text-sm font-normal text-[#3D2E2B] outline-none focus:border-[#8D593A]" /></label>)}</div>
        <label className="flex items-center gap-2 text-xs font-bold text-[#63534B]"><input type="checkbox" checked={Boolean(addressForm.isDefault)} onChange={(e) => setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))} /> ตั้งเป็นที่อยู่หลัก</label>
        <div className="flex justify-end gap-2 border-t border-[#F2ECE4] pt-4"><button type="button" onClick={() => setAddressModal(null)} className="rounded-full border px-4 py-2 text-sm">ยกเลิก</button><button disabled={addressSaving} className="rounded-full bg-[#4C1F08] px-5 py-2 text-sm font-bold text-white">{addressSaving ? "กำลังบันทึก..." : "บันทึกที่อยู่"}</button></div>
      </form></div>}

      {/* ===================================================================== */}
      {/* 🌟 Modal 1: Popup ฟอร์มแก้ไขข้อมูลส่วนตัว                                */}
      {/* ===================================================================== */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs animate-fade-in"
          onClick={() => !isConfirmOpen && setIsEditModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#E8DFD1] overflow-hidden transform transition-all animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F2ECE4] bg-[#FAF8F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#8D593A] text-white flex items-center justify-center shadow-xs">
                  <EditPencilIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-base text-[#3D2E2B]">แก้ไขข้อมูลส่วนตัวและที่อยู่</h3>
                  <span className="text-[11px] text-[#7A6B63]">ข้อมูลนี้จะใช้สำหรับการติดต่อและจัดส่ง Cooking Kit</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#EAE2D5] text-[#7A6B63] flex items-center justify-center transition cursor-pointer"
                aria-label="ปิดหน้าต่าง"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handlePreSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3D2E2B] mb-1">ชื่อจริง *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="เช่น กานต์"
                    className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D2E2B] mb-1">นามสกุล *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="เช่น สมใจ"
                    className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#3D2E2B] mb-1">อีเมล *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#3D2E2B] mb-1">เบอร์โทรศัพท์ติดต่อ</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="เช่น 089-876-5432"
                    className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              {!isAdmin && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-[#3D2E2B] mb-1">กรุ๊ปเลือด</label>
                    <select
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                    >
                      <option value="A">กรุ๊ป A</option>
                      <option value="B">กรุ๊ป B</option>
                      <option value="AB">กรุ๊ป AB</option>
                      <option value="O">กรุ๊ป O</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#3D2E2B] mb-1">เพศ</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                    >
                      <option value="female">หญิง</option>
                      <option value="male">ชาย</option>
                      <option value="other">อื่นๆ / ไม่ระบุ</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Delivery Address Section */}
              <div className="pt-3 border-t border-[#F2ECE4] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#3D2E2B]">
                  <TruckIcon className="w-3.5 h-3.5 text-[#8D593A]" />
                  <span>ที่อยู่จัดส่งสินค้า</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#7A6B63] mb-1">
                    บ้านเลขที่, หมู่บ้าน/อาคาร, ถนน, ซอย
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="เช่น 123/45 ซอยวงศ์สว่าง 11 ถนนวงศ์สว่าง"
                    className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#7A6B63] mb-1">แขวง/ตำบล</label>
                    <input
                      type="text"
                      name="subdistrict"
                      value={formData.subdistrict}
                      onChange={handleChange}
                      placeholder="บางซื่อ"
                      className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7A6B63] mb-1">เขต/อำเภอ</label>
                    <input type="text" name="district" value={formData.district} onChange={handleChange} placeholder="บางซื่อ" className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7A6B63] mb-1">จังหวัด</label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      placeholder="กรุงเทพมหานคร"
                      className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                    ><option value="">เลือกจังหวัด</option>{THAI_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}</select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#7A6B63] mb-1">รหัสไปรษณีย์</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="10800"
                      className="w-full rounded-xl border border-[#E8DFD1] px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-[#8D593A] bg-[#FAF8F5]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#F2ECE4]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-[#D4C5B0] text-xs font-bold text-[#63534B] hover:bg-[#FAF8F5] transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#4C1F08] hover:bg-[#6B3215] text-white text-xs font-bold transition shadow-sm cursor-pointer active:scale-95"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 🌟 Modal 2: Confirmation Popup Dialog (ยืนยันการเปลี่ยนแปลงข้อมูล)       */}
      {/* ===================================================================== */}
      {isConfirmOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => !saving && setIsConfirmOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#E8DFD1] p-6 space-y-4 transform transition-all animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-3 border-b border-[#F2ECE4]">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-black text-[#3D2E2B]">ยืนยันการบันทึกข้อมูล?</h4>
                <p className="text-xs text-[#7A6B63]">กรุณาตรวจสอบความถูกต้องของข้อมูล</p>
              </div>
            </div>

            {/* Quick Summary of Changes */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE2D5] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#7A6B63]">ชื่อ-นามสกุล:</span>
                <span className="font-bold text-[#3D2E2B]">{formData.firstName} {formData.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A6B63]">เบอร์โทรศัพท์:</span>
                <span className="font-bold text-[#3D2E2B]">{formData.phone || "-"}</span>
              </div>
              {!isAdmin && (
                <div className="flex justify-between">
                  <span className="text-[#7A6B63]">กรุ๊ปเลือด:</span>
                  <span className="font-bold text-[#3D2E2B]">{formData.bloodType}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#EAE2D5]/70">
                <span className="text-[#7A6B63] block mb-1">ที่อยู่จัดส่งใหม่:</span>
                <p className="font-semibold text-[#3D2E2B] leading-relaxed">
                  {formData.street
                    ? `${formData.street} ${formData.district} ${formData.province} ${formData.postalCode}`
                    : "ที่อยู่เดิม"}
                </p>
              </div>
            </div>

            {/* Confirmation Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 rounded-full border border-[#D4C5B0] text-xs font-bold text-[#7A6B63] hover:bg-[#FAF8F5] transition cursor-pointer disabled:opacity-50"
              >
                กลับไปแก้ไข
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleConfirmedSave}
                className="px-5 py-2 rounded-full bg-[#8D593A] hover:bg-[#6B3215] text-white text-xs font-bold transition shadow-sm cursor-pointer disabled:opacity-50 active:scale-95 flex items-center gap-1.5"
              >
                {saving ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <span>ยืนยันบันทึกข้อมูล</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
