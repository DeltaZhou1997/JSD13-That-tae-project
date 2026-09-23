import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.js";
import useToast from "../hooks/useToast.js";
import { getApiUrl } from "../utils/authHeader.js";
import defaultAvatar from "../assets/default-avatar.svg";
import { IconAlert, UserFormFields } from "../components/common/UserFormParts.jsx";
import { createEmptyUserForm, toRegisterPayload, validateUserForm } from "../utils/userForm.js";

// ─── Main Component ───────────────────────────────────────────────────────────
function Register() {
  const [formData, setFormData] = useState(createEmptyUserForm);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrorMsg("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    setErrorMsg("");
  };

  const validate = () => validateUserForm(formData);

  const handleRegister = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setErrorMsg(err); return; }

    setLoading(true);
    setErrorMsg("");

    try {
      const apiUrl = getApiUrl();
      const payload = { ...toRegisterPayload(formData), role: "customer" };

      const response = await fetch(`${apiUrl}/api/v2/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let data = {};
      try { data = await response.json(); }
      catch { data = { message: `เกิดข้อผิดพลาด (HTTP ${response.status})` }; }

      if (response.ok) {
        // Auto-login ทันที
        if (data.user && data.token) {
          // อัปโหลดรูปก่อน แล้วค่อย login ครั้งเดียว (login จะดึงโปรไฟล์เต็มจาก DB รวม avatar ที่เพิ่งบันทึก)
          let avatar = "";
          if (avatarFile && data.user.id) {
            try {
              const uploadData = new FormData();
              uploadData.append("image", avatarFile);
              const uploadResponse = await fetch(`${apiUrl}/api/v2/images/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${data.token}` },
                body: uploadData,
              });
              const uploaded = await uploadResponse.json().catch(() => ({}));
              if (uploadResponse.ok && uploaded.url) {
                avatar = uploaded.url;
              } else {
                toast.error(uploaded.message || "อัปโหลดรูปโปรไฟล์ไม่สำเร็จ สามารถเปลี่ยนรูปได้ที่หน้าโปรไฟล์");
              }
            } catch {
              toast.error("อัปโหลดรูปโปรไฟล์ไม่สำเร็จ สามารถเปลี่ยนรูปได้ที่หน้าโปรไฟล์");
            }
          }
          login({ ...data.user, deliveryAddress: data.user.deliveryAddress || payload.deliveryAddress, avatar }, data.token);
        }
        toast.success(`ยินดีต้อนรับคุณ ${data.user?.firstName || formData.firstName}!`);
        // สมัครสมาชิค → quiz ทำธาตุเจ้าเรือน → landing page พร้อม token
        navigate("/quiz", { state: { fromRegister: true, autoStart: true } });
      } else {
        setErrorMsg(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch {
      setErrorMsg("ไม่สามารถเชื่อมต่อได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdf7ef] to-[#fdfbf7] flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#3a1f08] tracking-tight">
            สมัครสมาชิก That Tae
          </h1>
          <p className="mt-2 text-sm text-[#7a6557] max-w-sm mx-auto leading-relaxed">
            กรอกข้อมูลเพื่อรับเมนูอาหารและชุด Cooking Kit ที่เหมาะกับสุขภาพของคุณ
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-5 text-sm font-medium">
            <IconAlert />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4" noValidate>

          <UserFormFields
            formData={formData}
            onChange={handleChange}
            avatarPreview={avatarPreview}
            onAvatarChange={handleAvatarChange}
          />

          {/* ── ปุ่ม Submit ── */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4c1f08] text-white py-3.5 rounded-xl text-base font-bold shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>กำลังสร้างบัญชี...</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span>สมัครสมาชิก</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#7a6557]">
          มีบัญชีอยู่แล้ว?{" "}
          <Link
            to="/login"
            className="text-[#4c1f08] font-bold underline underline-offset-2 hover:text-[#8b5e34] transition"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
