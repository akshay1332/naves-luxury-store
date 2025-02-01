import React, { useState } from "react";
import { Sidebar, SidebarContent, SidebarItem } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  MessageSquare,
  Star,
  Tag,
  Settings,
  LogOut,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export function AdminSidebar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Analytics",
      href: "/admin/analytics",
      icon: <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Reviews",
      href: "/admin/reviews",
      icon: <Star className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
    {
      label: "Coupons",
      href: "/admin/coupons",
      icon: <Tag className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
    },
  ];

  return (
    <SidebarProvider defaultOpen={open}>
      <Sidebar>
        <SidebarContent className="flex flex-col justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarItem key={idx} asChild>
                  <Link to={link.href} className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </SidebarItem>
              ))}
            </div>
          </div>
          <div>
            <SidebarItem asChild>
              <Link to="/admin/settings" className="flex items-center gap-2">
                <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                <span>Settings</span>
              </Link>
            </SidebarItem>
            <SidebarItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
              <span>Logout</span>
            </SidebarItem>
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

const Logo = () => {
  return (
    <Link
      to="/admin"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Admin Panel
      </motion.span>
    </Link>
  );
};