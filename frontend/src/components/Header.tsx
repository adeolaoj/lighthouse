"use client";

export default function Header() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "0 20px",
      height: "56px",
      flexShrink: 0,
      borderBottom: "1px solid rgba(192,132,252,0.1)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
        {/* Lighthouse Logo */}
        <svg width="16" height="20" viewBox="0 0 20 26" fill="none">
          <rect x="7" y="0" width="6" height="3" rx="1.5" fill="#C084FC" />
          <rect x="6" y="3" width="8" height="2" rx="1" fill="#C084FC" opacity="0.8" />
          <rect x="7" y="5" width="6" height="11" rx="1" fill="rgba(192,132,252,0.45)" />
          <rect x="5" y="16" width="10" height="2" rx="1" fill="#C084FC" opacity="0.7" />
          <polygon points="2,26 18,26 15,18 5,18" fill="rgba(192,132,252,0.25)" />
          <line x1="10" y1="2" x2="2" y2="0" stroke="#FCD34D" strokeWidth="1.4" opacity="0.9" />
          <line x1="10" y1="2" x2="0" y2="5" stroke="#FCD34D" strokeWidth="0.8" opacity="0.5" />
        </svg>
        <span style={{ fontSize: "15px", fontWeight: "500", color: "white", letterSpacing: "-0.3px" }}>
          lighthouse
        </span>
      </div>
    </div>
  );
}
