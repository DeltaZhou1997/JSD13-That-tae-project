import { useCallback, useMemo, useState } from "react";
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

  const login = useCallback((user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } catch (e) {
      console.error("Failed to save user to localStorage", e);
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("currentUser");
    } catch (e) {
      console.error("Failed to remove user from localStorage", e);
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
    () => ({ currentUser, login, logout, updateUser }),
    [currentUser, login, logout, updateUser],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
