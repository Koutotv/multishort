"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/app-context";
import {
  LayoutDashboard,
  Link2,
  Upload,
  Video,
  Settings,
  LogOut,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/publish", label: "Publier une vidéo", icon: Upload },
  { href: "/videos", label: "Mes vidéos", icon: Video },
  { href: "/platforms", label: "Mes plateformes", icon: Link2 },
  { href: "/settings", label: "Paramètres", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-200/80 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-600/30">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-900">MultiShort</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", isActive ? "text-violet-600" : "text-slate-400")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200/80 p-4">
        <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="truncate text-sm font-medium text-slate-900">
            {user?.fullName}
          </p>
          <p className="truncate text-xs text-slate-500">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-md lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <Menu className="h-5 w-5 text-slate-700" />
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-200/80 transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute right-4 top-4 lg:hidden"
          aria-label="Fermer le menu"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>
        <NavContent />
      </aside>
    </>
  );
}
