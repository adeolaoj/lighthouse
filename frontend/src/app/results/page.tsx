"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { useQuery } from "convex/react";
import {api} from "@convex/_generated/api";
import { OpportunityCard } from "@/components/OpportunityCard";
import { Opportunity } from "@/types/Opportunity";

const CARD_COLORS = [
  "#a855f7", "#6366f1", "#ec4899", "#14b8a6", "#f59e0b", "#3b82f6",
];

export default function ResultsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const opportunitiesData = useQuery(api.opportunities.get_opportunities, { limit: 10 });

  const loading = opportunitiesData === undefined;
  const isError = opportunitiesData instanceof Error;
  const isEmpty = !loading && !isError && opportunitiesData.length === 0;

  const opportunities: Opportunity[] = (isError || !opportunitiesData ? [] : opportunitiesData).map((opportunity, i) => ({
    id: opportunity.id,
    labURL: opportunity.labURL,
    labName: opportunity.labName,
    labDescription: opportunity.labDescription,
    headFaculty: opportunity.headFaculty ?? "",
    researchFocus: opportunity.researchFocus,
    researchPositionTitle: opportunity.researchPositionTitle,
    postedAt: opportunity.postedAt,
    color: CARD_COLORS[i % CARD_COLORS.length],
  }));

  function handleToggleSave(id: string) {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleViewLab(opportunity: Opportunity) {
    // TODO: add test coverage once real navigation is wired up
    // Temporary: just log the opportunity for now
    // Will eventually take users to the lab's page
    console.log("View lab for opportunity:", opportunity);
  }

  return (
    <PageLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="scroll-area flex-1 min-w-0 overflow-auto">
        <main className="px-8 pt-8 pb-[60px]">
          {/* Page content will go here */}
          <h1 className="text-[28px] font-semibold text-white mb-6 tracking-tight">
            Opportunities for You
          </h1>

          {/* Loading State */}
          {loading && (
            <div className="rounded-2xl border border-white/10 px-5 py-4 text-white/85">
              Loading opportunities...
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="rounded-2xl border border-white/10 px-5 py-4 text-white/85">
              Something went wrong loading opportunities. Please try again later.
            </div>
          )}

          {/* Empty State */}
          {isEmpty && (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: 24,
                color: "rgba(255,255,255,0.9)",
                maxWidth: 720,
              }}
            >
              <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
                No opportunities yet
              </h2>
              <p style={{ margin: "10px 0 18px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
              Our lighthouse is still scanning the horizon. Update your profile and we’ll start spotting opportunities for you.
              </p>
            </div>
          )}

          {/* Opportunities Grid */}
          {!loading && !isEmpty && (
            <div className="columns-1 xl:columns-2 gap-4">
              {opportunities.map((opportunity, index) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  saved={savedIds.has(opportunity.id)}
                  animationDelay={index * 0.1}
                  onToggleSave={handleToggleSave}
                  onViewLab={handleViewLab}
                />
              ))}
            </div>
          )}

        </main>
      </div>
    </PageLayout>
  );
}