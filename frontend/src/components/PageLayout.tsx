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
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #0A0714 0%, #110A24 40%, #160C2E 70%, #0E0919 100%)",
      fontFamily: "'Poppins', sans-serif",
      display: "flex",
      alignItems: "stretch",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
      height: "100vh",
    }}>

      {/* INNER ROUNDED PANEL */}
      <div style={{
        position: "relative",
        zIndex: 10,
        flex: 1,
        borderRadius: "22px",
        background: "rgba(255,255,255,0.04)",
        WebkitBackdropFilter: "blur(32px)",
        border: "1px solid rgba(192,132,252,0.15)",
        boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset, 0 32px 80px rgba(0,0,0,0.5)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        color: "#E2E8F0",
        minHeight: 0,
      }}>
        {/* TOP HEADER */}
        <Header />

        {/* BODY ROW: sidebar + scrollable main */}
        <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
          {/* SIDEBAR */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* MAIN CONTENT */}
          {children}
        </div>
      </div>
    </div>
  );
}
