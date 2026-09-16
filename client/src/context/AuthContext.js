import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth ต้องถูกเรียกภายใน <AuthProvider> เท่านั้น");
  }
  return context;
}
