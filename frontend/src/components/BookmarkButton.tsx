"use client";

interface BookmarkButtonProps {
  saved: boolean;
  color: string;
  onToggle: () => void;
}

export function BookmarkButton({ saved, color, onToggle }: BookmarkButtonProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={saved ? "Remove from saved" : "Save opportunity"}
      className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-[9px] transition-all duration-200 cursor-pointer"
      style={{
        border: `1px solid ${saved ? color + "80" : "rgba(192,132,252,0.2)"}`,
        background: saved ? color + "22" : "rgba(192,132,252,0.07)",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={saved ? color : "none"}
        stroke={saved ? color : "rgba(192,132,252,0.5)"}
        strokeWidth="2"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}