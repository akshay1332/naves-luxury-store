import React, { createContext, useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isMobile: boolean;
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  open?: boolean;
  setOpen?: (value: boolean) => void;
}

export function Sidebar({ children, className, open, setOpen }: SidebarProps) {
  const sidebarContext = useSidebar();
  const isOpen = open !== undefined ? open : sidebarContext.isOpen;

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background",
        className
      )}
      initial={false}
      animate={{ x: isOpen ? 0 : "-100%" }}
    >
      {children}
    </motion.div>
  );
}

interface SidebarBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarBody({ children, className }: SidebarBodyProps) {
  return (
    <div className={cn("flex h-full flex-col p-4", className)}>
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
    <a
      href={link.href}
      onClick={onClick}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
    >
      {link.icon}
      <span>{link.label}</span>
    </a>
  );
}