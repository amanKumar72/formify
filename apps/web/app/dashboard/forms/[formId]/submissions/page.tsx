"use client";

import { ArrowLeft, ExternalLink, FileText, ImageIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { DashboardShell } from "~/components/dashboard-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useGetAllFormSubmissionsByFormId, useGetFormById } from "~/hooks/api/form";
import type { UploadedFileValue } from "~/lib/file-upload";

type SubmittedField = {
  labelKey: string;
  value: string | UploadedFileValue;
};

type FormSubmission = {
  id: string;
  formId: string;
  userId: string | null;
  ip: string;
  userAgent: string | null;
  submittedData?: unknown;
  createdAt: Date | string | null;
};

const parseSubmittedData = (submittedData: unknown): SubmittedField[] => {
  let parsed: unknown;

  try {
    parsed = typeof submittedData === "string" ? JSON.parse(submittedData) : submittedData;
  } catch {
    return [];
  }

  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter((field): field is SubmittedField => {
    if (!field || typeof field !== "object") {
      return false;
    }

    const record = field as Record<string, unknown>;
    return typeof record.labelKey === "string" && "value" in record;
  });
};

const formatLabel = (labelKey: string) =>
  labelKey
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const isUploadedFileValue = (value: SubmittedField["value"]): value is UploadedFileValue =>
  typeof value === "object" &&
  value !== null &&
  "url" in value &&
  "publicId" in value &&
  "filename" in value &&
  "resourceType" in value;

const isPdfFile = (value: UploadedFileValue) =>
  value.mimeType === "application/pdf" || value.filename.toLowerCase().endsWith(".pdf");

const formatSubmittedValue = (value: SubmittedField["value"]) => {
  if (isUploadedFileValue(value)) {
    return value.filename;
  }

  return value || "-";
};

const SubmissionValue = ({ value }: { value: SubmittedField["value"] }) => {
  if (!isUploadedFileValue(value)) {
    return <span className="break-words text-foreground">{value || "-"}</span>;
  }

  const isImage = value.resourceType === "image";
  const isPdf = isPdfFile(value);

  return (
    <div className="space-y-3">
      {isImage && !isPdf && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value.url}
          alt={value.filename}
          className="max-h-56 w-full rounded-lg border border-white/10 object-contain"
        />
      )}
      <a
        href={value.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex max-w-full items-center gap-2 text-primary hover:underline"
      >
        {isImage ? (
          <ImageIcon className="size-4 shrink-0" />
        ) : (
          <FileText className="size-4 shrink-0" />
        )}
        <span className="truncate">{value.filename}</span>
        <ExternalLink className="size-3.5 shrink-0" />
      </a>
      {isPdf && (
        <p className="text-xs leading-5 text-on-surface-variant">
          If this PDF does not open, enable PDF and ZIP file delivery in Cloudinary Security
          settings for this product environment.
        </p>
      )}
    </div>
  );
};

const FormSubmissionsPage = () => {
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const { form } = useGetFormById(formId);
  const { allSubmissions, isLoading } = useGetAllFormSubmissionsByFormId(formId);
  const selectedFields = selectedSubmission
    ? parseSubmittedData(selectedSubmission.submittedData)
    : [];

  return (
    <DashboardShell
      title="Submissions"
      action={
        <Link
          href={`/dashboard/forms/${formId}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-2 font-body text-sm font-bold text-foreground transition-colors hover:bg-white/5 hover:text-primary"
        >
          <ArrowLeft className="size-4" />
          Back to form
        </Link>
      }
    >
      <main className="h-full overflow-y-auto p-6 md:p-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-primary">Responses</p>
              <h1 className="mt-2 font-heading text-4xl font-bold text-foreground">
                {form?.title ?? "Form submissions"}
              </h1>
              <p className="mt-3 text-on-surface-variant">
                Review every response and open a full field-by-field detail view.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-sm text-on-surface-variant">Total submissions</p>
              <p className="mt-1 font-heading text-2xl font-bold text-foreground">
                {allSubmissions?.length ?? 0}
              </p>
            </div>
          </div>

          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            {isLoading ? (
              <div className="rounded-lg border border-white/10 bg-surface-container p-6 text-on-surface-variant">
                Loading submissions...
              </div>
            ) : allSubmissions?.length ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-on-surface-variant">Submitted</TableHead>
                    <TableHead className="text-on-surface-variant">Fields</TableHead>
                    <TableHead className="text-on-surface-variant">Preview</TableHead>
                    <TableHead className="text-right text-on-surface-variant">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allSubmissions.map((submission) => {
                    const submittedFields = parseSubmittedData(submission.submittedData);
                    const submittedAt = submission.createdAt
                      ? new Date(submission.createdAt).toLocaleString()
                      : "No date";
                    const preview = submittedFields
                      .slice(0, 2)
                      .map((field) => formatSubmittedValue(field.value))
                      .join(", ");

                    return (
                      <TableRow key={submission.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="text-foreground">{submittedAt}</TableCell>
                        <TableCell className="text-on-surface-variant">
                          {submittedFields.length}
                        </TableCell>
                        <TableCell className="max-w-[26rem] truncate text-on-surface-variant">
                          {preview || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedSubmission(submission)}
                            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-primary transition-colors hover:bg-white/5"
                          >
                            View details
                          </button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-10 text-center text-on-surface-variant">
                No submissions yet.
              </div>
            )}
          </section>
        </div>
      </main>

      <Dialog
        open={Boolean(selectedSubmission)}
        onOpenChange={(open) => !open && setSelectedSubmission(null)}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto border-white/10 bg-background text-foreground sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submission details</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.createdAt
                ? new Date(selectedSubmission.createdAt).toLocaleString()
                : "No submission date"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedFields.map((field) => (
              <div
                key={field.labelKey}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <p className="mb-2 text-sm font-semibold text-on-surface-variant">
                  {formatLabel(field.labelKey)}
                </p>
                <SubmissionValue value={field.value} />
              </div>
            ))}
            {selectedFields.length === 0 && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-on-surface-variant">
                No submitted fields found.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
};

export default FormSubmissionsPage;
