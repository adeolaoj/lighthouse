"use client";

import {
  Home,
  FileText,
  Bookmark,
  User,
} from "lucide-react";
import { CollapseButton, NavButton } from "@/components/buttons";

interface NavItem {
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: <Home size={16} strokeWidth={1.8} /> },
  { label: "Results", icon: <FileText size={16} strokeWidth={1.8} /> },
  { label: "Saved", icon: <Bookmark size={16} strokeWidth={1.8} /> },
  { label: "Profile", icon: <User size={16} strokeWidth={1.8} /> },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const SIDEBAR_W = sidebarOpen ? 240 : 68;

  return (
    <aside style={{
      width: SIDEBAR_W,
      flexShrink: 0,
      transition: "width 0.28s cubic-bezier(0.4,0,0.2,1)",
      borderRight: "1px solid rgba(192,132,252,0.1)",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      position: "sticky",
      top: 0,
      alignSelf: "flex-start",
      height: "calc(100vh - 56px - 40px)",
    }}>

      {/* Collapse toggle */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: sidebarOpen ? "flex-end" : "center",
        padding: "12px 10px 8px",
      }}>
        <CollapseButton isOpen={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* User block */}
      <div style={{
        padding: "14px",
        display: "flex", alignItems: "center",
        justifyContent: sidebarOpen ? "flex-start" : "center",
        gap: "10px",
        borderBottom: "1px solid rgba(192,132,252,0.08)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: "rgba(192,132,252,0.2)",
          border: "1.5px solid rgba(192,132,252,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "11px", fontWeight: "600", color: "#E9D5FF",
        }}>SN</div>
        {sidebarOpen && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: "13px", fontWeight: "500", color: "white", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>Student Name</div>
            <div style={{ fontSize: "11px", color: "rgba(196,181,253,0.5)", fontWeight: "400", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>CS | Junior</div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav style={{ padding: "12px 10px", flex: 1 }}>
        {NAV_ITEMS.map(item => (
          <NavButton
            key={item.label}
            isActive={item.label === "Results"}
            isOpen={sidebarOpen}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </nav>
    </aside>
  );
}
