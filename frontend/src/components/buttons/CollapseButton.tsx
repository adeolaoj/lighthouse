"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface CollapseButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function CollapseButton({ isOpen, onClick }: CollapseButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 28,
        height: 28,
        borderRadius: "8px",
        background: "rgba(192,132,252,0.1)",
        border: "1px solid rgba(192,132,252,0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: "#C084FC",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
    >
      {isOpen ? (
        <ChevronLeft size={13} strokeWidth={2.5} />
      ) : (
        <ChevronRight size={13} strokeWidth={2.5} />
      )}
    </button>
  );
}
