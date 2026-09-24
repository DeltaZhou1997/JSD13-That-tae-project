import React, { useId } from "react";

import { TIER_THEME } from "../../constants/tierTheme";

/**
 * ตรายศตามระดับสมาชิก (SVG)
 * Bronze = โล่ | Silver = โล่ + ปีก | Gold = โล่ + ช่อมะกอก + มงกุฎ | Platinum = ดาวแปดแฉก + อัญมณี + มงกุฎ
 */
export default function TierBadge({ tier = "BRONZE", size = 120, animated = false, className = "" }) {
  const uid = useId().replace(/:/g, "");
  const id = String(tier).toUpperCase();
  const t = TIER_THEME[id] || TIER_THEME.BRONZE;
  const g = (name) => `${name}-${uid}`;
  const level = { BRONZE: 1, SILVER: 2, GOLD: 3, PLATINUM: 4 }[id] || 1;

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`${animated ? "tier-badge-float" : ""} ${className}`}
      role="img"
      aria-label={`ตรายศ ${id}`}
    >
      <defs>
        <linearGradient id={g("metal")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={t.light} />
          <stop offset="0.5" stopColor={t.mid} />
          <stop offset="1" stopColor={t.dark} />
        </linearGradient>
        <linearGradient id={g("inner")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={t.mid} />
          <stop offset="1" stopColor={t.dark} />
        </linearGradient>
        <linearGradient id={g("shine")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={g("glow")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={t.light} stopOpacity="0.8" />
          <stop offset="1" stopColor={t.light} stopOpacity="0" />
        </radialGradient>
        <clipPath id={g("clip")}>
          <path d="M100 30 L150 48 L150 100 C150 132 128 156 100 170 C72 156 50 132 50 100 L50 48 Z" />
        </clipPath>
      </defs>

      {/* แสงรอบตรา */}
      {level >= 3 && <circle cx="100" cy="100" r="96" fill={`url(#${g("glow")})`} className={animated ? "tier-badge-pulse" : ""} />}

      {/* Platinum: ดาวแปดแฉกด้านหลัง */}
      {level === 4 && (
        <g className={animated ? "tier-badge-spin" : ""} style={{ transformOrigin: "100px 100px" }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <path
              key={i}
              d="M100 4 L110 40 L90 40 Z"
              fill={`url(#${g("metal")})`}
              transform={`rotate(${i * 45} 100 100)`}
              opacity="0.9"
            />
          ))}
        </g>
      )}

      {/* Silver ขึ้นไป: ปีก */}
      {level >= 2 && (
        <g fill={`url(#${g("metal")})`} stroke={t.dark} strokeWidth="2">
          <path d="M52 70 C30 64 14 74 8 92 C22 88 30 92 34 98 C22 100 16 108 14 120 C28 112 40 114 50 118 Z" />
          <path d="M148 70 C170 64 186 74 192 92 C178 88 170 92 166 98 C178 100 184 108 186 120 C172 112 160 114 150 118 Z" />
        </g>
      )}

      {/* Gold ขึ้นไป: ช่อมะกอก */}
      {level >= 3 && (
        <g fill={t.mid} stroke={t.dark} strokeWidth="1.2">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <ellipse cx={58 - i * 3} cy={150 - i * 16} rx="9" ry="4.5" transform={`rotate(${-50 + i * 12} ${58 - i * 3} ${150 - i * 16})`} />
              <ellipse cx={142 + i * 3} cy={150 - i * 16} rx="9" ry="4.5" transform={`rotate(${50 - i * 12} ${142 + i * 3} ${150 - i * 16})`} />
            </g>
          ))}
        </g>
      )}

      {/* ตัวโล่ */}
      <path
        d="M100 22 L158 43 L158 100 C158 138 132 164 100 180 C68 164 42 138 42 100 L42 43 Z"
        fill={`url(#${g("metal")})`}
        stroke={t.dark}
        strokeWidth="3"
      />
      <path
        d="M100 30 L150 48 L150 100 C150 132 128 156 100 170 C72 156 50 132 50 100 L50 48 Z"
        fill={`url(#${g("inner")})`}
      />

      {/* แถบแสงวิ่งผ่านโล่ */}
      {animated && (
        <g clipPath={`url(#${g("clip")})`}>
          <rect x="-60" y="20" width="40" height="160" fill={`url(#${g("shine")})`} className="tier-badge-shine" transform="skewX(-20)" />
        </g>
      )}

      {/* สัญลักษณ์กลางโล่: เบี้ย (เหรียญ) + ดาวตามระดับ */}
      <circle cx="100" cy="98" r="26" fill={`url(#${g("metal")})`} stroke={t.light} strokeWidth="2" />
      <circle cx="100" cy="98" r="19" fill="none" stroke={t.dark} strokeWidth="1.5" strokeDasharray="3 3" />
      {level === 4 ? (
        // อัญมณี
        <g>
          <path d="M100 82 L113 94 L100 116 L87 94 Z" fill={t.light} stroke={t.dark} strokeWidth="1.5" />
          <path d="M87 94 L113 94 M100 82 L94 94 L100 116 L106 94 Z" fill="none" stroke={t.dark} strokeWidth="1" />
        </g>
      ) : (
        <text x="100" y="106" textAnchor="middle" fontSize="22" fontWeight="800" fill={t.dark} fontFamily="inherit">
          เบี้ย
        </text>
      )}
      <g fill={t.light} stroke={t.dark} strokeWidth="1">
        {Array.from({ length: level }).map((_, i) => {
          const x = 100 + (i - (level - 1) / 2) * 16;
          return (
            <path
              key={i}
              d={`M${x} 132 l2.4 5 5.4 .6 -4 3.7 1.1 5.3 -4.9 -2.7 -4.9 2.7 1.1 -5.3 -4 -3.7 5.4 -.6z`}
            />
          );
        })}
      </g>

      {/* Gold ขึ้นไป: มงกุฎ */}
      {level >= 3 && (
        <g>
          <path
            d="M74 30 L80 8 L92 22 L100 4 L108 22 L120 8 L126 30 Z"
            fill={`url(#${g("metal")})`}
            stroke={t.dark}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="100" cy="4" r="3.5" fill={t.ribbon} />
        </g>
      )}

      {/* ริบบิ้นชื่อระดับ */}
      <path d="M40 160 L160 160 L152 176 L160 192 L40 192 L48 176 Z" fill={t.ribbon} stroke={t.dark} strokeWidth="1.5" />
      <text x="100" y="182" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" letterSpacing="2" fontFamily="inherit">
        {id}
      </text>
    </svg>
  );
}
