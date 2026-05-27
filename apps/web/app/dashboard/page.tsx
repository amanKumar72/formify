"use client";

import { BarChart3, Clock, FileText, MousePointerClick } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "~/components/dashboard-shell";
import { useGetAllFormSubmissions, useGetMyAllForms } from "~/hooks/api/form";

const Dashboard = () => {
  const { allForms } = useGetMyAllForms();
  const { allSubmissions } = useGetAllFormSubmissions();

  const formCount = allForms?.length ?? 0;
  const submissionCount = allSubmissions?.length ?? 0;
  const completionRate = formCount
    ? Math.min(100, Math.round((submissionCount / formCount) * 12))
    : 0;
  const latestSubmission = allSubmissions?.[0]?.createdAt;

  const stats = [
    {
      label: "Total Forms",
      value: String(formCount),
      detail: `${formCount} saved forms`,
      icon: FileText,
    },
    {
      label: "Responses",
      value: String(submissionCount),
      detail: "Total collected submissions",
      icon: BarChart3,
    },
    {
      label: "Activity Rate",
      value: `${completionRate}%`,
      detail: "Relative to active forms",
      icon: MousePointerClick,
    },
    {
      label: "Latest Response",
      value: latestSubmission ? new Date(latestSubmission).toLocaleDateString() : "None",
      detail: "Most recent submission",
      icon: Clock,
    },
  ];

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
                Live stats from your forms and submissions.
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
              <h2 className="font-heading text-xl font-bold">Forms by responses</h2>
              <div className="mt-8 flex h-64 items-end gap-3">
                {(allForms ?? []).slice(0, 8).map((form) => {
                  const count =
                    allSubmissions?.filter((submission) => submission.formId === form.id).length ??
                    0;
                  const height = submissionCount ? Math.max(8, (count / submissionCount) * 100) : 8;

                  return (
                    <div key={form.id} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-lg bg-primary/80"
                        style={{ height: `${height}%` }}
                      />
                      <span className="max-w-full truncate text-xs text-on-surface-variant">
                        {form.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-heading text-xl font-bold">Recent forms</h2>
              <div className="mt-6 space-y-4">
                {(allForms ?? []).slice(0, 3).map((form) => (
                  <Link
                    key={form.id}
                    href={`/dashboard/forms/${form.id}`}
                    className="block rounded-lg bg-surface-container p-4 transition-colors hover:bg-surface-container-high"
                  >
                    <p className="font-body font-semibold text-foreground">{form.title}</p>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "No date"}
                    </p>
                  </Link>
                ))}
              </div>
            </article>
          </section>
        </div>
      </main>
    </DashboardShell>
  );
};

export default Dashboard;
