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
        {/* Insert Lighthouse Logo Here */}
        <span style={{ fontSize: "15px", fontWeight: "500", color: "white", letterSpacing: "-0.3px" }}>
          lighthouse
        </span>
      </div>
    </div>
  );
}
