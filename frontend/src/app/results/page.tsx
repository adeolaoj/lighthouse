"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";

export default function ResultsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <PageLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
      <div className="scroll-area flex-1 min-w-0 overflow-auto">
        <main className="px-8 pt-8 pb-[60px]">
          {/* Page content will go here */}
          <h1 className="text-[28px] font-semibold text-white mb-6 tracking-tight">
            Opportunities for You
          </h1>
        </main>
      </div>
    </PageLayout>
  );
}