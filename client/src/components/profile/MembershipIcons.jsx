import React from "react";

// ไอคอน SVG ของระบบเบี้ย/ระดับสมาชิก (ใช้แทน emoji ให้หน้าตาเหมือนกันทุกอุปกรณ์)
function Svg({ className = "w-4 h-4", children, ...rest }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function BagIcon(props) {
  return (
    <Svg {...props}>
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </Svg>
  );
}

export function CrownIcon(props) {
  return (
    <Svg {...props}>
      <path d="M3 8l4 4 5-7 5 7 4-4-2 11H5L3 8Z" />
      <path d="M5 19h14" />
    </Svg>
  );
}

export function PlusCircleIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </Svg>
  );
}

export function HeartIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </Svg>
  );
}

export function CoinIcon(props) {
  return (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5.5" strokeDasharray="2 2" />
      <path d="M12 9.5v5" />
    </Svg>
  );
}

export function TrophyIcon(props) {
  return (
    <Svg {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0V4Z" />
      <path d="M8 6H5a2 2 0 0 0 3 4M16 6h3a2 2 0 0 1-3 4" />
      <path d="M12 13v4M8 20h8M10 17h4" />
    </Svg>
  );
}

export function LightbulbIcon(props) {
  return (
    <Svg {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" />
    </Svg>
  );
}
