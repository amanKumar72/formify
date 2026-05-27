import type { BuilderField, FieldType } from "~/components/form-builder";

type ApiField = {
  id: string;
  type: string;
  label: string;
  placeholder: string | null;
  description: string | null;
  order: number | null;
  required: boolean | null;
  options?: string[] | null;
};

const fieldTypes = new Set<FieldType>([
  "text",
  "number",
  "email",
  "password",
  "checkbox",
  "radio",
  "select",
  "file",
]);

export const toBuilderField = (field: ApiField): BuilderField => ({
  id: field.id,
  type: fieldTypes.has(field.type as FieldType) ? (field.type as FieldType) : "text",
  label: field.label,
  placeholder: field.placeholder ?? "",
  description: field.description ?? "",
  order: field.order ?? 0,
  required: field.required ?? false,
  options: Array.isArray(field.options) ? field.options : [],
});

export const getPublicFormLink = (formId: string) => {
  if (typeof window === "undefined") {
    return `/forms/${formId}`;
  }

  return `${window.location.origin}/forms/${formId}`;
};
