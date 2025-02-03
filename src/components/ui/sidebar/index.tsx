import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";

interface SidebarContextProps {
  isOpen: boolean;
  isMobile: boolean;
  state: {
    isOpen: boolean;
    isMobile: boolean;
  };
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const value = {
    isOpen,
    isMobile,
    state: {
      isOpen,
      isMobile,
    },
    toggleSidebar,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export function Sidebar({ children, className }: SidebarProps) {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-gray-900 transition-transform duration-300",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto p-4">{children}</div>;
}

export function SidebarTrigger() {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
    >
      <span className="sr-only">Toggle Sidebar</span>
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
}