"use client";

import React from "react";
import { AdminProvider, useAdmin } from "../../context/AdminContext";
import AdminLoginScreen from "../../components/admin/AdminLoginScreen";
import { 
  LayoutDashboard, 
  FolderKanban, 
  Trophy, 
  UserCircle, 
  LogOut,
  Briefcase,
  ChevronRight,
  Menu,
  GraduationCap,
  Image as ImageIcon,
  Code2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Toaster } from "sonner";
import ThemeToggle from "@/components/ThemeToggle";

function AdminLayoutContent({ children }) {
  const { isAuthorized, isLoading, login, logout, adminKey } = useAdmin();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <AdminLoginScreen
        handleLogin={login}
        isLoading={isLoading}
      />
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Achievements", href: "/admin/achievements", icon: Trophy },
    { name: "Responsibilities", href: "/admin/responsibilities", icon: Briefcase },
    { name: "Education", href: "/admin/education", icon: GraduationCap },
    { name: "Skills", href: "/admin/skills", icon: Code2 },
    { name: "Profile", href: "/admin/profile", icon: UserCircle },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex text-slate-800 dark:text-zinc-100 font-sans">
      <Toaster position="top-right" richColors />
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[90] lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[100] w-64 h-screen bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0
        flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-10 pl-2">
             <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold shadow-sm">A</div>
             <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Admin Console</h2>
          </div>

          <nav className="flex flex-col gap-2 w-full">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    group flex items-center justify-between w-full px-4 py-2.5 rounded-md transition-all duration-200 font-medium text-sm
                    ${isActive 
                      ? "bg-orange-500/10 text-orange-600 dark:text-orange-400" 
                      : "text-slate-600 dark:text-zinc-400 hover:text-orange-600 hover:bg-slate-50 dark:hover:bg-zinc-900"}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={isActive ? "text-orange-600 dark:text-orange-400" : "text-slate-400 group-hover:text-orange-600 transition-colors"} />
                    <span className="tracking-tight">{item.name}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-transform duration-200 ${isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-1"}`} />
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-zinc-800 space-y-3">
          <div className="hidden lg:flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">Theme</span>
            <ThemeToggle />
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 transition-all duration-200 text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Mobile */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold">A</div>
             <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Admin</h2>
           </div>
           <div className="flex items-center gap-2">
             <ThemeToggle />
             <button 
              onClick={() => setIsSidebarOpen(true)}
              className="min-h-11 min-w-11 p-2 rounded-md hover:bg-slate-50 dark:hover:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 flex items-center justify-center"
             >
               <Menu size={20} />
             </button>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-zinc-950">
           <div className="p-6 md:p-10 max-w-6xl">
             {children}
           </div>
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <AdminProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminProvider>
  );
}
