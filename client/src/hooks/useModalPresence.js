import { useEffect, useState } from "react";

/**
 * คุม animation เข้า/ออกของ modal
 * - open = true  → mount ทันที (เล่น .modal-*-enter)
 * - open = false → ค้างไว้ `duration` ms ให้เล่น .modal-*-exit จนจบ แล้วค่อย unmount
 */
export default function useModalPresence(open, duration = 200) {
  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    setClosing(true);
    const timer = setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration]);

  return { mounted, closing };
}
