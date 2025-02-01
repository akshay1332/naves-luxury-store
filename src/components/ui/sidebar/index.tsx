import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarContextProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SidebarProvider = ({ children, defaultOpen = true }: SidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, ...props }, ref) => {
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
      >
        {children}
      </motion.div>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex h-full w-full flex-col', className)} {...props} />
  )
);

SidebarContent.displayName = 'SidebarContent';

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex h-14 items-center border-b px-4', className)}
      {...props}
    />
  )
);

SidebarHeader.displayName = 'SidebarHeader';

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex h-14 items-center border-t px-4', className)}
      {...props}
    />
  )
);

SidebarFooter.displayName = 'SidebarFooter';

export const SidebarItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900',
        className
      )}
      {...props}
    />
  )
);

SidebarItem.displayName = 'SidebarItem';