import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext.js";

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("currentUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [accessToken, setAccessToken] = useState(() => {
    try {
      return (
        localStorage.getItem("accessToken") ||
        localStorage.getItem("token") ||
        null
      );
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  // ตรวจสอบความถูกต้องของ Token จริงกับเซิร์ฟเวอร์ (GET /api/v1/users/me)
  useEffect(() => {
    let isMounted = true;
    async function verifySession() {
      const token =
        localStorage.getItem("accessToken") || localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const apiUrl = (import.meta.env.VITE_API_URL || "http://localhost:3001").replace(/\/+$/, "");
        const res = await fetch(`${apiUrl}/api/v1/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user && isMounted) {
            setCurrentUser(data.user);
            localStorage.setItem("currentUser", JSON.stringify(data.user));
          }
        } else if (res.status === 401) {
          // Token หมดอายุหรือไม่ถูกต้อง
          if (isMounted) {
            setCurrentUser(null);
            setAccessToken(null);
            localStorage.removeItem("currentUser");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("token");
          }
        }
      } catch (err) {
        console.warn("⚠️ ไม่สามารถยืนยัน Token กับเซิร์ฟเวอร์ได้ ใช้ Local Session:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    verifySession();
    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback((user, token) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }

    if (token) {
      setAccessToken(token);
      try {
        localStorage.setItem("accessToken", token);
        localStorage.setItem("token", token);
      } catch (e) {
        console.error("Failed to save accessToken to localStorage", e);
      }
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAccessToken(null);
    try {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("token");
    } catch (e) {
      console.error("Failed to remove auth data from localStorage", e);
    }
  }, []);

  const updateUser = useCallback((updatedData) => {
    setCurrentUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
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
    }),
    [currentUser, accessToken, isLoading, login, logout, updateUser],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
