"use client";

import type { Opportunity } from "@/types/Opportunity";
import { BookmarkButton } from "@/components/BookmarkButton";
import { InfoBlock } from "@/components/InfoBlock";

interface OpportunityCardProps {
  opportunity: Opportunity;
  saved: boolean;
  animationDelay?: number;
  onToggleSave: (id: string) => void;
  onViewLab: (opportunity: Opportunity) => void;
}

export function OpportunityCard({
  opportunity,
  saved,
  animationDelay = 0,
  onToggleSave,
  onViewLab,
}: OpportunityCardProps) {
  const {
    id,
    labName,
    labDescription,
    headFaculty,
    opportunityType,
    researcherInformation,
    researchFocus,
    researchPositionTitle,
    color,
  } = opportunity;

  return (
    <div
      className="
        opportunity-card
        inline-block w-full rounded-2xl overflow-hidden
        transition-[transform,box-shadow] duration-200 ease-out
        cursor-default
        [animation:fadeUp_0.4s_ease_both]
        break-inside-avoid mb-4
      "
      style={{ animationDelay: `${animationDelay}s` }}
    >
      {/* Accent bar */}
      <div
        className="h-[2px] opacity-75"
        style={{ background: color }}
      />

      <div className="p-[18px_20px]">

        {/* Header: lab name + bookmark */}
        <div className="flex items-start gap-3 mb-[10px]">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-semibold text-white m-0 mb-[3px] leading-[1.3] tracking-[-0.1px]">
              {researchPositionTitle ?? labName}
            </h3>
            <p className="text-[12px] font-normal m-0 text-purple-200/50">
              {headFaculty} &bull; {opportunityType}
            </p>
          </div>

          <BookmarkButton
            saved={saved}
            color={color}
            onToggle={() => onToggleSave(id)}
          />
        </div>

        {/* Info blocks */}
        <div className="grid grid-cols-2 gap-[10px] mb-[14px]">
          <InfoBlock
            label="Lab Description"
            content={labDescription}
          />
          <InfoBlock
            label="Why It's a Match"
            // Will be updated to show match insights in the future
            content={researcherInformation ? researcherInformation : "Your profile matches the research focus and requirements of this lab."}
            accentColor={color}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={() => onViewLab(opportunity)}
            className="
              view-lab-btn
              flex items-center gap-[5px]
              text-[12px] font-medium font-poppins
              px-4 py-[7px] rounded-[9px]
              text-purple-100
              transition-colors duration-200 cursor-pointer
            "
          >
            View Lab
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}