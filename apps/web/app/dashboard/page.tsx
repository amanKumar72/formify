"use client";

import { BarChart3, Clock, FileText, MousePointerClick } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "~/components/dashboard-shell";

const stats = [
  {
    label: "Total Forms",
    value: "12",
    detail: "4 published",
    icon: FileText,
  },
  {
    label: "Responses",
    value: "1,284",
    detail: "+18% this week",
    icon: BarChart3,
  },
  {
    label: "Completion Rate",
    value: "72%",
    detail: "Across active forms",
    icon: MousePointerClick,
  },
  {
    label: "Avg. Time",
    value: "2m 14s",
    detail: "Per submission",
    icon: Clock,
  },
];

const Dashboard = () => {
  return (
    <DashboardShell title="Dashboard Home">
      <main className="h-full overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-primary">Dashboard</p>
              <h1 className="mt-2 font-heading text-4xl font-bold text-foreground">
                Workspace analytics
              </h1>
              <p className="mt-3 max-w-2xl text-on-surface-variant">
                A quick pulse on form activity, response quality, and conversion performance.
              </p>
            </div>
            <Link
              href="/dashboard/create-form"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create Form
            </Link>
          </div>

          <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-on-surface-variant">{stat.label}</p>
                    <Icon className="size-5 text-primary" />
                  </div>
                  <p className="mt-4 font-heading text-4xl font-bold text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-on-surface-variant">{stat.detail}</p>
                </article>
              );
            })}
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.8fr]">
            <article className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-heading text-xl font-bold">Response trend</h2>
              <div className="mt-8 flex h-64 items-end gap-3">
                {[32, 48, 38, 72, 64, 88, 76, 96].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t-lg bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-heading text-xl font-bold">Recent activity</h2>
              <div className="mt-6 space-y-4">
                {["Lead form published", "18 new submissions", "Contact form edited"].map(
                  (activity) => (
                    <div key={activity} className="rounded-lg bg-surface-container p-4">
                      <p className="font-body font-semibold text-foreground">{activity}</p>
                      <p className="mt-1 text-sm text-on-surface-variant">Just now</p>
                    </div>
                  ),
                )}
              </div>
            </article>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
};

export default Dashboard;
