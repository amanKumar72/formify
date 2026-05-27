"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { DashboardSidebar } from "~/components/dashboard-sidebar";
import { UserMenu } from "~/components/user-menu";
import { useUser } from "~/hooks/api/auth";

type DashboardShellProps = {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
};

export const DashboardShell = ({ children, title = "Dashboard", action }: DashboardShellProps) => {
  const router = useRouter();
  const { user, isLoading, isError } = useUser();

  useEffect(() => {
    if (!isLoading && (!user || isError)) {
      router.push("/signin");
    }
  }, [isError, isLoading, router, user]);

  if (isLoading || !user || isError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background font-body text-on-surface-variant">
        Loading workspace...
      </main>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-body">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-heading text-3xl font-bold text-foreground">
              FormFlow
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {["Dashboard", "Analytics", "Templates", "API"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-body text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden font-mono text-xs font-bold text-on-surface-variant lg:block">
              {title}
            </span>
            {action}
            <UserMenu user={user} />
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
