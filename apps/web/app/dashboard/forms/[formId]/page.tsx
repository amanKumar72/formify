"use client";

import { Edit, Share2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DashboardShell } from "~/components/dashboard-shell";
import { FormRenderer } from "~/components/form-renderer";
import { ShareFormDialog } from "~/components/share-form-dialog";
import {
  useGetAllFormSubmissionsByFormId,
  useGetFormById,
  useGetFormFields,
} from "~/hooks/api/form";
import { getPublicFormLink, toBuilderField } from "~/lib/form-utils";

const FormView = () => {
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { form, isLoading: isFormLoading } = useGetFormById(formId);
  const { formFields, isLoading: areFieldsLoading } = useGetFormFields(formId);
  const { allSubmissions } = useGetAllFormSubmissionsByFormId(formId);
  const fields = (formFields ?? []).map(toBuilderField);
  const shareLink = getPublicFormLink(formId);

  return (
    <DashboardShell
      title="Form View"
      action={
        <>
          <button
            type="button"
            onClick={() => setIsShareOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary"
            aria-label="Share form"
          >
            <Share2 className="size-5" />
          </button>
          <Link
            href={`/dashboard/forms/${formId}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Edit className="size-4" />
            Edit
          </Link>
        </>
      }
    >
      <main className="h-full overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-[1000px]">
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-on-surface-variant">Fields</p>
              <p className="mt-2 font-heading text-3xl font-bold">{fields.length}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-on-surface-variant">Responses</p>
              <p className="mt-2 font-heading text-3xl font-bold">{allSubmissions?.length ?? 0}</p>
            </article>
            <article className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-on-surface-variant">Required Fields</p>
              <p className="mt-2 font-heading text-3xl font-bold">
                {fields.filter((field) => field.required).length}
              </p>
            </article>
          </div>
          {isFormLoading || areFieldsLoading || !form ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-on-surface-variant">
              Loading form...
            </div>
          ) : (
            <FormRenderer title={form.title} description={form.description} fields={fields} />
          )}
        </div>
      </main>
      <ShareFormDialog open={isShareOpen} link={shareLink} onClose={() => setIsShareOpen(false)} />
    </DashboardShell>
  );
};

export default FormView;
