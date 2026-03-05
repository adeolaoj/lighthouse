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
      className={`w-full flex items-center ${isOpen ? 'gap-3 justify-start px-3.5' : 'gap-0 justify-center px-2.5'} py-2.5 rounded-lg mb-1 border-none ${isActive ? 'bg-purple-600/20' : 'bg-transparent'} ${isActive ? 'text-purple-light' : 'text-slate-400/55'} text-xs ${isActive ? 'font-medium' : 'font-normal'} font-poppins cursor-pointer text-left transition-all whitespace-nowrap overflow-hidden`}
      aria-current={isActive ? "page" : undefined}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && label}
    </button>
  );
}
