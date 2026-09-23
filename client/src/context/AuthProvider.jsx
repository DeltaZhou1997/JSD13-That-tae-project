import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { getApiUrl } from "../utils/authHeader.js";
import { resolveImageUrl } from "../utils/imageUrl.js";

// ผลควิซของ guest ที่เก็บในเครื่อง — ต้องล้างตอน logout ไม่งั้นบัญชีถัดไปจะเห็นธาตุของคนก่อนหน้า
const GUEST_QUIZ_KEYS = ["quizResult", "userElement"];

function normalizeUser(user) {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,
    avatar: resolveImageUrl(user.avatar) || "",
  };
}

function getStoredToken() {
  try {
    return localStorage.getItem("accessToken") || localStorage.getItem("token") || null;
  } catch {
    return null;
  }
}

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? normalizeUser(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(getStoredToken);

  const [isLoading, setIsLoading] = useState(true);

  // นับรอบการดึง /me — ใช้ผลเฉพาะรอบล่าสุด กันผลเก่ามาทับข้อมูลใหม่ (เช่น logout/login สลับบัญชีเร็ว ๆ)
  const refreshSeqRef = useRef(0);

  const saveUser = useCallback((user) => {
    const normalized = normalizeUser(user);
    setCurrentUser(normalized);
    try {
      if (normalized) localStorage.setItem("currentUser", JSON.stringify(normalized));
      else localStorage.removeItem("currentUser");
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }
    return normalized;
  }, []);

  const clearSession = useCallback(() => {
    refreshSeqRef.current += 1;
    setCurrentUser(null);
    setAccessToken(null);
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
      GUEST_QUIZ_KEYS.forEach((key) => localStorage.removeItem(key));
    } catch (e) {
      console.error("Failed to remove auth data from localStorage", e);
    }
  }, []);

  // ดึงข้อมูลผู้ใช้ล่าสุดจากฐานข้อมูล (GET /api/v2/users/me) ให้ Frontend ตรงกับ Backend เสมอ
  const refreshUser = useCallback(
    async (token = getStoredToken()) => {
      if (!token) return null;
      const seq = ++refreshSeqRef.current;
      try {
        const res = await fetch(`${getApiUrl()}/api/v2/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (seq !== refreshSeqRef.current || getStoredToken() !== token) return null;

        if (res.ok) {
          const data = await res.json();
          if (data.user) return saveUser(data.user);
        } else if (res.status === 401) {
          // Token หมดอายุหรือไม่ถูกต้อง
          clearSession();
        }
      } catch (err) {
        console.warn("⚠️ ไม่สามารถยืนยัน Token กับเซิร์ฟเวอร์ได้ ใช้ Local Session:", err.message);
      }
      return null;
    },
    [saveUser, clearSession],
  );

  // ตรวจสอบความถูกต้องของ Token จริงกับเซิร์ฟเวอร์ตอนเปิดเว็บ
  useEffect(() => {
    let isMounted = true;
    refreshUser().finally(() => {
      if (isMounted) setIsLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(
    (user, token) => {
      if (token) {
        setAccessToken(token);
        try {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("token", token);
        } catch (e) {
          console.error("Failed to save accessToken to localStorage", e);
        }
      }
      saveUser(user);
      // โหลดโปรไฟล์เต็มจาก DB (avatar, ธาตุ, ที่อยู่) ทับข้อมูลจาก response ของ login/register
      refreshUser(token || getStoredToken());
    },
    [saveUser, refreshUser],
  );

  const logout = clearSession;

  const updateUser = useCallback((updatedData) => {
    setCurrentUser((prev) => {
      const nextUser = normalizeUser({ ...prev, ...updatedData });
      try {
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
      } catch (e) {
        console.error("Failed to update user in localStorage", e);
      }
      return nextUser;
    });
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      accessToken,
      token: accessToken,
      isAuthenticated: Boolean(currentUser && accessToken),
      isLoading,
      login,
      logout,
      updateUser,
      refreshUser,
    }),
    [currentUser, accessToken, isLoading, login, logout, updateUser, refreshUser],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
