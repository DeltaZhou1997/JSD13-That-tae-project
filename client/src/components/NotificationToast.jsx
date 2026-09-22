import { useEffect, useRef } from "react";
import gsap from "gsap";

const toastStyles = {
  success: {
    icon: "✓",
    label: "สำเร็จ",
    className: "border-[#b8d4bd] bg-[#f3faf4] text-[#284d30]",
    progressColor: "bg-[#284d30]/30",
  },
  error: {
    icon: "!",
    label: "เกิดข้อผิดพลาด",
    className: "border-[#e4b7af] bg-[#fff6f4] text-[#7a3027]",
    progressColor: "bg-[#7a3027]/30",
  },
};

function ToastItem({ toast, onDismiss }) {
  const cardRef = useRef(null);
  const progressRef = useRef(null);
  const isDismissingRef = useRef(false);
  const progressTweenRef = useRef(null);

  const style = toastStyles[toast.type] ?? toastStyles.success;
  const duration = toast.duration ?? 3500;

  const handleDismiss = () => {
    if (isDismissingRef.current || !cardRef.current) return;
    isDismissingRef.current = true;

    if (progressTweenRef.current) {
      progressTweenRef.current.kill();
    }

    gsap.to(cardRef.current, {
      x: 80,
      opacity: 0,
      scale: 0.85,
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
      duration: 0.35,
      ease: "power2.inOut",
      onComplete: () => {
        onDismiss(toast.id);
      },
    });
  };

  useEffect(() => {
    if (!cardRef.current) return;

    // GSAP Enter Animation (Smooth slide from right & gentle bounce)
    gsap.fromTo(
      cardRef.current,
      { x: 80, opacity: 0, scale: 0.9, y: -10 },
      { x: 0, opacity: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(1.2)" }
    );

    // Progress bar animation & auto dismiss
    if (duration > 0 && progressRef.current) {
      progressTweenRef.current = gsap.fromTo(
        progressRef.current,
        { width: "100%" },
        {
          width: "0%",
          duration: duration / 1000,
          ease: "linear",
          onComplete: handleDismiss,
        }
      );
    }

    return () => {
      if (progressTweenRef.current) {
        progressTweenRef.current.kill();
      }
    };
  }, []);

  const handleMouseEnter = () => {
    progressTweenRef.current?.pause();
  };

  const handleMouseLeave = () => {
    progressTweenRef.current?.play();
  };

  return (
    <div
      ref={cardRef}
      role={toast.type === "error" ? "alert" : "status"}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`pointer-events-auto relative flex w-full flex-col overflow-hidden rounded-2xl border shadow-[0_16px_40px_rgba(61,44,46,0.16)] backdrop-blur-md transition-shadow hover:shadow-[0_20px_45px_rgba(61,44,46,0.22)] ${style.className}`}
    >
      <div className="flex items-start gap-3 p-4">
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
          onClick={handleDismiss}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xl leading-none opacity-60 transition hover:bg-current/10 hover:opacity-100 cursor-pointer"
          aria-label="ปิดการแจ้งเตือน"
        >
          ×
        </button>
      </div>

      {/* GSAP Animated Progress Bar Indicator */}
      {duration > 0 && (
        <div className="h-1 w-full bg-black/5 overflow-hidden">
          <div ref={progressRef} className={`h-full w-full ${style.progressColor}`} />
        </div>
      )}
    </div>
  );
}

export default function NotificationToast({ toasts = [], onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-4 top-24 z-[200] flex flex-col items-end gap-3 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
