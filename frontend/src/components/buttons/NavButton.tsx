"use client";

import { ReactNode } from "react";

interface NavButtonProps {
  isActive: boolean;
  isOpen: boolean;
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}

export default function NavButton({ isActive, isOpen, icon, label, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: isOpen ? "12px" : "0",
        justifyContent: isOpen ? "flex-start" : "center",
        padding: isOpen ? "10px 14px" : "10px",
        borderRadius: "10px",
        marginBottom: "4px",
        border: "none",
        background: isActive ? "rgba(192,132,252,0.18)" : "transparent",
        color: isActive ? "#E9D5FF" : "rgba(148,163,184,0.55)",
        fontSize: "13px",
        fontWeight: isActive ? "500" : "400",
        fontFamily: "'Poppins', sans-serif",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        overflow: "hidden",
      }}
      aria-current={isActive ? "page" : undefined}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      {isOpen && label}
    </button>
  );
}
