"use client";

import { FileUp } from "lucide-react";
import { useState, type FormEvent } from "react";
import type { BuilderField } from "~/components/form-builder";
import type { SubmittedFormField, UploadedFileValue } from "~/lib/file-upload";

type FormRendererProps = {
  title: string;
  description?: string | null;
  fields: BuilderField[];
  submitLabel?: string;
  isSubmitting?: boolean;
  onSubmit?: (data: SubmittedFormField[]) => Promise<void> | void;
  onFileUpload?: (file: File, field: BuilderField) => Promise<UploadedFileValue>;
};

const getLabelKey = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

export const FormRenderer = ({
  title,
  description,
  fields,
  submitLabel = "Submit",
  isSubmitting = false,
  onSubmit,
  onFileUpload,
}: FormRendererProps) => {
  const sortedFields = [...fields].sort((first, second) => first.order - second.order);
  const [selectedFiles, setSelectedFiles] = useState<Record<string, string>>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!onSubmit) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const submittedData = await Promise.all(
      sortedFields.map(async (field) => {
        const value = formData.get(field.id);

        if (value instanceof File) {
          if (value.size === 0) {
            return {
              labelKey: getLabelKey(field.label),
              value: "",
            };
          }

          if (!onFileUpload) {
            throw new Error("File uploads are not available");
          }

          const uploadedFile = await onFileUpload(value, field);

          return {
            labelKey: getLabelKey(field.label),
            value: uploadedFile,
          };
        }

        return {
          labelKey: getLabelKey(field.label),
          value: value?.toString() ?? "",
        };
      }),
    );

    await onSubmit(submittedData);
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-xl border border-white/10 bg-white/5 p-6">
      <h1 className="font-heading text-3xl font-bold text-foreground">{title}</h1>
      {description && <p className="mt-2 text-on-surface-variant">{description}</p>}
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        {sortedFields.map((field) => (
          <div key={field.id}>
            <label className="mb-2 flex items-center gap-1 font-body text-sm font-semibold text-foreground">
              {field.label}
              {field.required && <span className="text-destructive">*</span>}
            </label>
            {field.description && (
              <p className="mb-2 text-sm text-on-surface-variant">{field.description}</p>
            )}
            <RenderedField
              field={field}
              selectedFilename={selectedFiles[field.id]}
              onSelectedFileChange={(filename) =>
                setSelectedFiles((current) => ({ ...current, [field.id]: filename }))
              }
            />
          </div>
        ))}
        {onSubmit && (
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-primary px-4 py-3 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : submitLabel}
          </button>
        )}
      </form>
    </div>
  );
};

const inputClass =
  "w-full rounded-lg border border-white/10 bg-surface-container px-4 py-3 text-foreground outline-none placeholder:text-on-surface-variant/60 focus:border-primary";

const RenderedField = ({
  field,
  selectedFilename,
  onSelectedFileChange,
}: {
  field: BuilderField;
  selectedFilename?: string;
  onSelectedFileChange: (filename: string) => void;
}) => {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-surface-container px-4 py-3 text-on-surface-variant">
        <input
          name={field.id}
          type="checkbox"
          value="true"
          required={field.required}
          className="size-4 accent-primary"
        />
        <span>{field.placeholder || "Checkbox option"}</span>
      </label>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="grid gap-3">
        {field.options.map((option, index) => (
          <label key={`${field.id}-${index}`} className="flex items-center gap-3">
            <input
              name={field.id}
              type="radio"
              value={option}
              required={field.required}
              className="size-4 accent-primary"
            />
            <span className="text-on-surface-variant">{option}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <select name={field.id} className={inputClass} defaultValue="" required={field.required}>
        <option value="" disabled>
          {field.placeholder || "Select an option"}
        </option>
        {field.options.map((option, index) => (
          <option key={`${field.id}-${index}`} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "file") {
    return (
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-surface-container px-4 py-6 text-center text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary">
        <FileUp className="mb-2 size-6" />
        <span>{field.placeholder || "Upload a file"}</span>
        {selectedFilename && (
          <span className="mt-2 max-w-full truncate text-sm text-foreground">
            {selectedFilename}
          </span>
        )}
        <input
          name={field.id}
          type="file"
          accept="image/*,application/pdf"
          required={field.required}
          className="sr-only"
          onChange={(event) => onSelectedFileChange(event.currentTarget.files?.[0]?.name ?? "")}
        />
      </label>
    );
  }

  return (
    <input
      name={field.id}
      type={field.type}
      required={field.required}
      className={inputClass}
      placeholder={field.placeholder}
    />
  );
};
