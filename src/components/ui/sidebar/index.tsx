import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  state: "open" | "closed";
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
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}

export function SidebarProvider({ 
  children, 
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile] = useState(window.innerWidth < 768);

  const open = openProp !== undefined ? openProp : isOpen;
  const setOpen = setOpenProp || setIsOpen;

  const toggleSidebar = () => setOpen(!open);

  return (
    <SidebarContext.Provider value={{ 
      isOpen: open, 
      setIsOpen: setOpen, 
      isMobile, 
      toggleSidebar,
      state: open ? "open" : "closed"
    }}>
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
    <motion.div
      initial={{ width: "0px" }}
      animate={{ width: isOpen ? "240px" : "60px" }}
      transition={{ duration: 0.3 }}
      className={cn(
        "h-screen bg-background border-r flex-shrink-0 overflow-hidden",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function SidebarContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("p-4 h-full flex flex-col", className)}>
      {children}
    </div>
  );
}

export function SidebarItem({ children, className, asChild, ...props }: { 
  children: React.ReactNode; 
  className?: string;
  asChild?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}