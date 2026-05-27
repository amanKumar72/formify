"use client";

import { BarChart3, FileText, Home, PlusCircle, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

const navItems = [
  {
    label: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    label: "My Forms",
    href: "/dashboard/forms",
    icon: FileText,
  },
  {
    label: "Create Form",
    href: "/dashboard/create-form",
    icon: PlusCircle,
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-20 shrink-0 flex-col items-center border-r border-white/10 bg-surface-container-lowest/80 px-3 py-6 backdrop-blur-xl">
      <div className="mb-8 flex size-11 items-center justify-center rounded-xl bg-primary font-heading text-lg font-bold text-primary-foreground">
        F
      </div>
      <nav className="flex w-full flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "group relative flex aspect-square w-full items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary",
                isActive &&
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              )}
            >
              <Icon className="size-5" />
              <span className="pointer-events-none absolute left-16 z-20 rounded-md border border-white/10 bg-surface-container-highest px-2 py-1 font-body text-xs text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      <nav className="mt-auto flex w-full flex-col gap-3">
        <Link
          href="/dashboard"
          title="Analytics"
          className="group relative flex aspect-square w-full items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary"
        >
          <BarChart3 className="size-5" />
          <span className="pointer-events-none absolute left-16 z-20 rounded-md border border-white/10 bg-surface-container-highest px-2 py-1 font-body text-xs text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Analytics
          </span>
        </Link>
        <Link
          href="/settings"
          title="Settings"
          className="group relative flex aspect-square w-full items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary"
        >
          <Settings className="size-5" />
          <span className="pointer-events-none absolute left-16 z-20 rounded-md border border-white/10 bg-surface-container-highest px-2 py-1 font-body text-xs text-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            Settings
          </span>
        </Link>
      </nav>
    </aside>
  );
};
