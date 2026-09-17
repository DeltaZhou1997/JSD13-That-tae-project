const toastStyles = {
  success: {
    icon: "✓",
    label: "สำเร็จ",
    className: "border-[#b8d4bd] bg-[#f3faf4] text-[#284d30]",
  },
  error: {
    icon: "!",
    label: "เกิดข้อผิดพลาด",
    className: "border-[#e4b7af] bg-[#fff6f4] text-[#7a3027]",
  },
};

export default function NotificationToast({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-4 top-28 z-[200] flex flex-col items-end gap-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] ?? toastStyles.success;

        return (
          <div
            key={toast.id}
            role={toast.type === "error" ? "alert" : "status"}
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border p-4 shadow-[0_16px_40px_rgba(61,44,46,0.16)] ${style.className}`}
          >
            <span
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-current/10 text-sm font-black"
              aria-hidden="true"
            >
              {style.icon}
            </span>
            <div className="min-w-0 flex-1">
              <strong className="block text-sm">{style.label}</strong>
              <p className="mt-0.5 break-words text-sm leading-6">{toast.message}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xl leading-none opacity-60 transition hover:bg-current/10 hover:opacity-100"
              aria-label="ปิดการแจ้งเตือน"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
