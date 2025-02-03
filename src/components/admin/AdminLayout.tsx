import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/lib/utils";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className={cn(
        "flex min-h-screen w-full bg-gray-100 dark:bg-neutral-900"
      )}>
        <AdminSidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}