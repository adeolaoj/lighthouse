interface InfoBlockProps {
  label: string;
  content: string;
  /** If provided, tints the block with the opportunity's accent color */
  accentColor?: string;
}

export function InfoBlock({ label, content, accentColor }: InfoBlockProps) {
  const isAccented = Boolean(accentColor);

  return (
    <div
      className="rounded-[10px] p-3"
      style={{
        background: isAccented ? `${accentColor}10` : "rgba(192,132,252,0.06)",
        border: `1px solid ${isAccented ? `${accentColor}28` : "rgba(192,132,252,0.1)"}`,
      }}
    >
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.08em] mb-[6px]"
        style={{
          color: isAccented ? `${accentColor}BB` : "rgba(192,132,252,0.55)",
        }}
      >
        {label}
      </p>
      <p className="text-[12px] leading-[1.65] text-slate-300/60 m-0 font-normal">
        {content}
      </p>
    </div>
  );
}