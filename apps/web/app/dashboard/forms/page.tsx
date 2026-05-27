"use client";

import { Calendar, FileText, Loader, PlusCircle } from "lucide-react";
import Link from "next/link";
import { DashboardShell } from "~/components/dashboard-shell";
import { useGetAllFormSubmissions, useGetMyAllForms } from "~/hooks/api/form";
import { groupBy } from "~/lib/utils";

const MyForms = () => {
  const { allForms, isLoading } = useGetMyAllForms();
  const { allSubmissions, isLoading: isSubmissionsLoading } = useGetAllFormSubmissions()
  console.log(allSubmissions)
  const groupedSubmissions = groupBy(allSubmissions || [], "formId");
  console.log(groupedSubmissions)
  if (isLoading || isSubmissionsLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader className="self-center w-20 h-20  animate-spin" /></div>
    ;
  }
  const getFormSubmissionCount = (formId: string) => {
    return groupedSubmissions[formId]?.length || 0;
  }
  return (
    <DashboardShell title="My Forms">
      <main className="h-full overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-primary">My Forms</p>
              <h1 className="mt-2 font-heading text-4xl font-bold text-foreground">Form library</h1>
              <p className="mt-3 max-w-2xl text-on-surface-variant">
                Manage drafts, published forms, and response collection from one workspace.
              </p>
            </div>
            <Link
              href="/dashboard/create-form"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <PlusCircle className="size-4" />
              Create Form
            </Link>
          </div>

          {allForms?.length ? (
            <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
              {allForms.map((form) => (
                <article key={form.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex size-11 items-center justify-center rounded-lg bg-surface-container">
                      <FileText className="size-5 text-primary" />
                    </div>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-on-surface-variant">
                      {form.createdAt ? "Draft" : "Draft"}
                    </span>
                  </div>
                  <h2 className="mt-5 font-heading text-xl font-bold text-foreground">
                    {form.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                    {form.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm text-on-surface-variant">
                    <span>{getFormSubmissionCount(form.id)} responses</span>
                    <span className="inline-flex items-center gap-2">
                      <Calendar className="size-4" />
                      Today
                    </span>
                  </div>
                </article>
              ))}
            </section>
          ) : (
            <div className="w-full mt-8 flex justify-center items-center">No forms found</div>
          )}
          {isLoading ? (
            <div className="mt-8 flex justify-center items-center">Loading...</div>
          ) : null}
        </div>
      </main>
    </DashboardShell>
  );
};

export default MyForms;
