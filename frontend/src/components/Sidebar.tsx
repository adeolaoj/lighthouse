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
    <aside
      style={{ width: SIDEBAR_W }}
      className="
        h-[calc(100vh-96px)]
        shrink-0 border-r border-purple-600/10
        flex flex-col overflow-hidden sticky top-0 self-start
        transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]
      "
    >

      {/* Collapse toggle */}
      <div className={`flex items-center ${sidebarOpen ? 'justify-end' : 'justify-center'} px-2.5 py-3 pb-2`}>
        <CollapseButton isOpen={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* User block */}
      <div className={`p-3.5 flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-2.5 border-b border-purple-600/8`}>
        <div className="w-9 h-9 rounded-full shrink-0 bg-purple-600/20 border-[1.5px] border-purple-600/45 flex items-center justify-center text-xs font-semibold text-purple-light font-poppins">
          SN
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <div className="text-xs font-medium text-white whitespace-nowrap font-poppins">Student Name</div>
            <div className="text-xs text-purple-light/50 font-normal whitespace-nowrap font-poppins">CS | Junior</div>
          </div>
        )}
      </div>

      {/* Nav links */}
      <nav className="px-2.5 py-3 flex-1">
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