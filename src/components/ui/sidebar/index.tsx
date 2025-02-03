import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarContextProps {
  isOpen: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
  state: {
    isOpen: boolean;
    isMobile: boolean;
  };
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const value = {
    isOpen,
    isMobile,
    toggleSidebar,
    state: {
      isOpen,
      isMobile,
    },
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
    <motion.aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white dark:bg-gray-900",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      initial={false}
      animate={{ x: isOpen ? 0 : -256 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.aside>
  );
}

export function SidebarBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col flex-1 overflow-y-auto p-4", className)}>
      {children}
    </div>
  );
}

interface SidebarLinkProps {
  link: {
    label: string;
    href: string;
    icon?: React.ReactNode;
  };
  onClick?: () => void;
}

export function SidebarLink({ link, onClick }: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {link.icon}
      <span className="text-sm font-medium">{link.label}</span>
    </button>
  );
}