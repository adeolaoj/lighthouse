"use client";

export default function Header() {
  return (
    <div className="flex items-center px-5 h-14 shrink-0 border-b border-purple-600/10">
      <div className="flex items-center gap-1">
        {/* Insert Lighthouse Logo Here */}
        <span className="text-sm font-medium text-white tracking-tight font-poppins">
          lighthouse
        </span>
      </div>
    </div>
  );
}
