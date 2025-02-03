import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
}

export function SidebarProvider({ children }: SidebarProviderProps) {
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

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  const { isOpen, isMobile } = useSidebar();

  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 transform bg-white transition-transform duration-200 ease-in-out dark:bg-gray-900",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
      initial={false}
      animate={{ x: isOpen ? 0 : "-100%" }}
      {...props}
    >
      {children}
    </motion.div>
  );
}