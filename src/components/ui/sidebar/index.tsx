import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

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

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const value = {
    isOpen,
    isMobile,
    toggleSidebar,
    state: {
      isOpen,
      isMobile
    }
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, ...props }, ref) => {
    const { isOpen } = useSidebar();

    return (
      <motion.div
        ref={ref}
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full transform bg-white transition-transform duration-300 ease-in-out dark:bg-gray-800',
          isOpen && 'translate-x-0',
          className
        )}
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        {...props}
      />
    );
  }
);

Sidebar.displayName = 'Sidebar';