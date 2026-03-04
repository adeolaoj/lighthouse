"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";

export default function ResultsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
        </main>
      </div>
    </PageLayout>
  );
}