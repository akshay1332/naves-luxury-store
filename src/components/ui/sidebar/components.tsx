import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";
import { useSidebar } from "./index";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const { open } = useSidebar();
  
  return (
    <motion.div
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-64 -translate-x-full border-r bg-background transition-transform",
        open && "translate-x-0",
        className
      )}
      {...props}
    />
  );
}

export function SidebarContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("h-full px-3 py-4", className)} {...props} />;
}

export function SidebarFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto", className)} {...props} />;
}

export function SidebarHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-3 py-4", className)} {...props} />;
}

export function SidebarItem({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-3 py-2", className)} {...props} />;
}

export function SidebarTrigger({ className, ...props }: HTMLAttributes<HTMLButtonElement>) {
  const { setOpen } = useSidebar();
  
  return (
    <button
      className={cn("p-2", className)}
      onClick={() => setOpen(prev => !prev)}
      {...props}
    />
  );
}