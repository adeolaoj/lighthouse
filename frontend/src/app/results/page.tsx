"use client";

import { useState } from "react";
import {useEffect} from "react";
import PageLayout from "@/components/PageLayout";

type Opportunity = {
  id: string;
  title: string;
  email: string;
  labURL: string;
  labName: string;
  labDescription: string;
  headFaculty: string;
  opportunityType: string;
  researcherInformation: string;
  ResearchFocus: string;
  postedAt: number;
}

export default function ResultsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(()=> {
    async function load() {
        setLoading(true);

        await new Promise((r) => setTimeout(r, 600));

        setOpportunities([]);
        setLoading(false);
    }
    load();
  }, []);

  const isEmpty = !loading && opportunities.length === 0;
  const hasData = !loading && opportunities.length > 0;

  return (
    <PageLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="scroll-area" style={{ flex: 1, minWidth: 0, overflow: "auto" }}>
        <main style={{ padding: "32px 32px 60px", flex: 1 }}>
          {/* Page content will go here */}
          <h1 style={{
            fontSize: "28px", fontWeight: "600", color: "white",
            margin: "0 0 24px", letterSpacing: "-0.5px",
          }}>
            Opportunities for You
          </h1>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 16,
                padding: 20,
                color: "rgba(255,255,255,0.85)",
              }}
            >
              Loading opportunities...
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
        </main>
      </div>
    </PageLayout>
  );
}