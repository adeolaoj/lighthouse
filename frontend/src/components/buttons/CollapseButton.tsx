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
      className="w-7 h-7 rounded-lg bg-purple-600/10 border border-purple-600/20 flex items-center justify-center cursor-pointer text-purple-primary transition-all shrink-0 hover:bg-purple-600/20"
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
