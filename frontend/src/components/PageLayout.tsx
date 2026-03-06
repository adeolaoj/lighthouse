"use client";

import { ReactNode } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface PageLayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function PageLayout({ children, sidebarOpen, setSidebarOpen }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-dark font-poppins flex items-stretch p-5 relative overflow-hidden h-screen">
      {/* INNER ROUNDED PANEL */}
      <div className="glass-panel min-h-0">
        {/* TOP HEADER */}
        <Header />

        {/* BODY ROW: sidebar + scrollable main */}
        <div className="flex flex-1 min-h-0">
          {/* SIDEBAR */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* MAIN CONTENT */}
          {children}
        </div>
      </div>
    </div>
  );
}
