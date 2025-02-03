import React from "react";
import { AdminSidebar } from "./AdminSidebar";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={cn(
      "flex min-h-screen bg-gray-100 dark:bg-neutral-900"
    )}>
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}