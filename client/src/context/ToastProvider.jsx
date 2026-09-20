import { useCallback, useMemo, useRef, useState } from "react";

import NotificationToast from "../components/NotificationToast.jsx";
import ToastContext from "./ToastContext.js";

const DEFAULT_DURATION = 3500;

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextIdRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, options = {}) => {
      const id = ++nextIdRef.current;
      const { type = "success", duration = DEFAULT_DURATION } = options;

      setToasts((current) => [
        ...current.slice(-3),
        { id, message, type },
      ]);

      if (duration > 0) {
        window.setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast],
  );

  const value = useMemo(
    () => ({
      showToast,
      removeToast,
      success: (message, duration) =>
        showToast(message, { type: "success", duration }),
      error: (message, duration) =>
        showToast(message, { type: "error", duration }),
    }),
    [removeToast, showToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <NotificationToast toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}
