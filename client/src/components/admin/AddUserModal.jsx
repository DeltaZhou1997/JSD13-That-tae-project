import { useEffect, useRef, useState } from "react";
import useToast from "../../hooks/useToast.js";
import useModalPresence from "../../hooks/useModalPresence.js";
import { getApiUrl, getAuthHeaders } from "../../utils/authHeader.js";
import defaultAvatar from "../../assets/default-avatar.svg";
import {
  IconAlert,
  SectionHeader,
  UserFormFields,
  inputBase,
  labelBase,
  sectionCard,
} from "../common/UserFormParts.jsx";
import { createEmptyUserForm, toRegisterPayload, validateUserForm } from "../../utils/userForm.js";

const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
  </svg>
);

const createEmptyAdminForm = () => ({ ...createEmptyUserForm(), role: "customer", tierStatus: "Bronze" });

/**
 * กล่องเพิ่มสมาชิกใหม่ของแอดมิน — ใช้ช่องกรอกชุดเดียวกับหน้าสมัครสมาชิก (UserFormFields)
 * พร้อม animation เปิด/ปิด และเพิ่มส่วนสิทธิ์ (Role) กับระดับสมาชิก (Tier) สำหรับแอดมิน
 */
export default function AddUserModal({ open, onClose, onCreated }) {
  const toast = useToast();
  const { mounted, closing } = useModalPresence(open);
  const [formData, setFormData] = useState(createEmptyAdminForm);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(defaultAvatar);
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef(null);

  // เปิดใหม่ทุกครั้งเริ่มจากฟอร์มว่าง
  useEffect(() => {
    if (!open) return;
    setFormData(createEmptyAdminForm());
    setAvatarFile(null);
    setAvatarPreview(defaultAvatar);
    setErrorMsg("");
  }, [open]);

  // กด Esc เพื่อปิด + ล็อกการเลื่อนหน้าหลังขณะเปิด
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !saving) onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, saving, onClose]);

  if (!mounted) return null;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateUserForm(formData);
    if (err) {
      setErrorMsg(err);
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSaving(true);
    setErrorMsg("");
    const apiUrl = getApiUrl();
    try {
      const res = await fetch(`${apiUrl}/api/v2/users/register`, {
        method: "POST",
        headers: getAuthHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          ...toRegisterPayload(formData),
          role: formData.role,
          tierStatus: formData.tierStatus,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.user) {
        throw new Error(data.message || "ไม่สามารถสร้างผู้ใช้ใหม่ได้");
      }

      let createdUser = data.user;
      // รูปโปรไฟล์: อัปโหลดด้วย token แอดมิน แล้วผูกเข้ากับบัญชีใหม่
      if (avatarFile) {
        try {
          const uploadData = new FormData();
          uploadData.append("image", avatarFile);
          const up = await fetch(`${apiUrl}/api/v2/images/upload`, {
            method: "POST",
            headers: getAuthHeaders(),
            body: uploadData,
          });
          const uploaded = await up.json().catch(() => ({}));
          if (!up.ok || !uploaded.url) throw new Error(uploaded.message);
          const newId = createdUser.id || createdUser._id;
          const put = await fetch(`${apiUrl}/api/v2/users/${newId}`, {
            method: "PUT",
            headers: getAuthHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify({ avatar: uploaded.url }),
          });
          const putData = await put.json().catch(() => ({}));
          if (put.ok && putData.user) createdUser = putData.user;
        } catch {
          toast.error("สร้างบัญชีแล้ว แต่อัปโหลดรูปโปรไฟล์ไม่สำเร็จ");
        }
      }

      toast.success(`เพิ่มสมาชิกคุณ "${createdUser.firstName}" สำเร็จ`);
      onCreated?.(createdUser);
      onClose();
    } catch (error) {
      setErrorMsg(error.message || "ไม่สามารถสร้างผู้ใช้ใหม่ได้");
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  };

  const adminSection = (
    <div className={sectionCard}>
      <SectionHeader icon={<IconShield />} label="สิทธิ์และระดับสมาชิก (สำหรับแอดมิน)" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className={labelBase}>สิทธิ์การใช้งาน (Role)</label>
          <select name="role" value={formData.role} onChange={handleChange} className={inputBase}>
            <option value="customer">ลูกค้าสมาชิก (Customer)</option>
            <option value="admin">ผู้ดูแลระบบ (Admin)</option>
          </select>
        </div>
        <div>
          <label className={labelBase}>ระดับสมาชิก (Tier)</label>
          <select name="tierStatus" value={formData.tierStatus} onChange={handleChange} className={inputBase}>
            {["Bronze", "Silver", "Gold", "Platinum"].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs ${
        closing ? "modal-backdrop-exit" : "modal-backdrop-enter"
      }`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
        className={`flex w-full max-w-2xl max-h-[92vh] flex-col overflow-hidden rounded-3xl border border-[#f1ead7] bg-gradient-to-b from-[#fdf7ef] to-[#fdfbf7] shadow-2xl ${
          closing ? "modal-panel-exit" : "modal-panel-enter"
        }`}
      >
        {/* Header — แบบเดียวกับหน้าสมัครสมาชิก */}
        <div className="relative shrink-0 border-b border-[#f0e8da] px-6 pb-4 pt-6 text-center">
          <h2 id="add-user-title" className="text-xl sm:text-2xl font-extrabold text-[#3a1f08] tracking-tight">
            เพิ่มสมาชิกใหม่
          </h2>
          <p className="mt-1 text-sm text-[#7a6557]">
            กรอกข้อมูลเหมือนการสมัครสมาชิก — สมาชิกใช้อีเมลและรหัสผ่านนี้เข้าสู่ระบบได้ทันที
          </p>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="ปิด"
            className="absolute right-4 top-4 grid h-9 w-9 cursor-pointer place-items-center rounded-full bg-white text-[#7a6557] shadow-xs ring-1 ring-[#f0e8da] transition hover:rotate-90 hover:bg-[#f5ece2] hover:text-[#4c1f08] disabled:opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4" aria-hidden="true">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="flex min-h-0 flex-1 flex-col">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
            {errorMsg && (
              <div className="modal-panel-enter flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                <IconAlert />
                <span>{errorMsg}</span>
              </div>
            )}

            <UserFormFields
              formData={formData}
              onChange={handleChange}
              avatarPreview={avatarPreview}
              onAvatarChange={handleAvatarChange}
              extraSection={adminSection}
            />
          </div>

          {/* Footer */}
          <div className="flex shrink-0 justify-end gap-2 border-t border-[#f0e8da] bg-white/70 px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="cursor-pointer rounded-full bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-300 disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex cursor-pointer items-center gap-2 rounded-full bg-[#4c1f08] px-6 py-2.5 text-sm font-bold text-white shadow-md transition duration-200 hover:-translate-y-0.5 hover:bg-[#6b3215] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  กำลังสร้างบัญชี...
                </>
              ) : (
                "สร้างสมาชิกใหม่"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
