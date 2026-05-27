"use client";

import {
  AlignLeft,
  AtSign,
  CheckSquare,
  Copy,
  FileUp,
  Hash,
  KeyRound,
  ListFilter,
  PlusCircle,
  Radio,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { cn } from "~/lib/utils";

type FieldType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "checkbox"
  | "radio"
  | "select"
  | "file";

export type BuilderField = {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  description: string;
  order: number;
  required: boolean;
  options: string[];
};

export type FormSnapshot = {
  title: string;
  description: string;
  fields: Array<
    BuilderField & {
      labelKey: string;
    }
  >;
};

type FormBuilderProps = {
  publishRequest?: number;
  onPublish:(data:FormSnapshot)=>void
};

const fieldTypes: Array<{
  type: FieldType;
  label: string;
  group: "Basic" | "Choice";
  icon: typeof AlignLeft;
}> = [
  { type: "text", label: "Text", group: "Basic", icon: AlignLeft },
  { type: "number", label: "Number", group: "Basic", icon: Hash },
  { type: "email", label: "Email", group: "Basic", icon: AtSign },
  { type: "password", label: "Password", group: "Basic", icon: KeyRound },
  { type: "checkbox", label: "Checkbox", group: "Choice", icon: CheckSquare },
  { type: "radio", label: "Radio", group: "Choice", icon: Radio },
  { type: "select", label: "Select", group: "Choice", icon: ListFilter },
  { type: "file", label: "File", group: "Choice", icon: FileUp },
];

const fieldDefaults: Record<
  FieldType,
  Pick<BuilderField, "label" | "placeholder" | "description" | "options">
> = {
  text: {
    label: "Text Field",
    placeholder: "Enter text",
    description: "Short answer response.",
    options: [],
  },
  number: {
    label: "Number Field",
    placeholder: "42",
    description: "Numeric response.",
    options: [],
  },
  email: {
    label: "Email Address",
    placeholder: "jane@example.com",
    description: "A valid email address.",
    options: [],
  },
  password: {
    label: "Password",
    placeholder: "********",
    description: "Private text response.",
    options: [],
  },
  checkbox: {
    label: "Agreement",
    placeholder: "I agree to the terms",
    description: "Single true or false choice.",
    options: [],
  },
  radio: {
    label: "Choose One",
    placeholder: "",
    description: "Single option from a fixed list.",
    options: ["Option A", "Option B", "Option C"],
  },
  select: {
    label: "Select Option",
    placeholder: "Choose an option",
    description: "Dropdown selection.",
    options: ["Starter", "Professional", "Enterprise"],
  },
  file: {
    label: "Upload File",
    placeholder: "PDF, PNG, or JPG",
    description: "Collect a file attachment.",
    options: [],
  },
};

const initialFields: BuilderField[] = [
  {
    id: "field-name",
    type: "text",
    label: "Full Name",
    placeholder: "Jane Doe",
    description: "Use the name from your legal documents.",
    order: 1,
    required: true,
    options: [],
  },
  {
    id: "field-email",
    type: "email",
    label: "Email Address",
    placeholder: "jane@example.com",
    description: "We will send confirmation here.",
    order: 2,
    required: true,
    options: [],
  },
  {
    id: "field-plan",
    type: "select",
    label: "Plan Interest",
    placeholder: "Select a plan",
    description: "Choose the plan that best matches your team.",
    order: 3,
    required: false,
    options: ["Starter", "Professional", "Enterprise"],
  },
];

const createField = (type: FieldType, order: number): BuilderField => {
  const defaults = fieldDefaults[type];

  return {
    id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    label: defaults.label,
    placeholder: defaults.placeholder,
    description: defaults.description,
    order,
    required: false,
    options: defaults.options,
  };
};

const fieldSlug = (label: string) =>
  label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const FieldPreview = ({ field }: { field: BuilderField }) => {
  const baseInputClass =
    "w-full rounded-t-lg border-b border-white/20 bg-surface-container-highest/30 px-4 py-3 font-body text-foreground outline-none placeholder:text-on-surface-variant/60";

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-surface-container-highest/20 px-4 py-3 text-on-surface-variant">
        <input type="checkbox" disabled className="size-4 accent-primary" />
        <span>{field.placeholder || "Checkbox option"}</span>
      </label>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="grid gap-3">
        {field.options.map((option, index) => (
          <label
            key={`${option}-${index}`}
            className="flex items-center gap-3 text-on-surface-variant"
          >
            <input type="radio" disabled className="size-4 accent-primary" />
            <span>{option}</span>
          </label>
        ))}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <select disabled className={baseInputClass} value="">
        <option value="">{field.placeholder || "Select an option"}</option>
        {field.options.map((option, index) => (
          <option key={`${option}-${index}`}>{option}</option>
        ))}
      </select>
    );
  }

  if (field.type === "file") {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-white/20 bg-surface-container-highest/20 px-4 py-6 text-center text-on-surface-variant">
        <FileUp className="mb-2 size-6 text-primary" />
        <span>{field.placeholder || "Upload a file"}</span>
      </div>
    );
  }

  return (
    <input
      disabled
      type={field.type}
      className={baseInputClass}
      placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
    />
  );
};

export const FormBuilder = ({ publishRequest = 0, onPublish }: FormBuilderProps) => {
  const [title, setTitle] = useState("Contact Information");
  const [description, setDescription] = useState("Please provide your details below.");
  const [fields, setFields] = useState<BuilderField[]>(initialFields);
  const [selectedFieldId, setSelectedFieldId] = useState(initialFields[0]?.id ?? "");
  const [publishedData, setPublishedData] = useState<FormSnapshot | null>(null);

  const sortedFields = useMemo(
    () => [...fields].sort((first, second) => first.order - second.order),
    [fields],
  );
  const selectedField = fields.find((field) => field.id === selectedFieldId) ?? fields[0];

  useEffect(() => {
    if (publishRequest === 0) {
      return;
    }

    setPublishedData({
      title,
      description,
      fields: sortedFields.map((field) => ({
        ...field,
        labelKey: fieldSlug(field.label),
      })),
    });
  }, [description, publishRequest, sortedFields, title]);

  const addField = (type: FieldType) => {
    const nextOrder = fields.length ? Math.max(...fields.map((field) => field.order)) + 1 : 1;
    const field = createField(type, nextOrder);
    setFields((current) => [...current, field]);
    setSelectedFieldId(field.id);
  };

  const updateField = (id: string, patch: Partial<BuilderField>) => {
    setFields((current) =>
      current.map((field) => {
        if (field.id !== id) {
          return field;
        }

        if (patch.type && patch.type !== field.type) {
          const defaults = fieldDefaults[patch.type];
          return {
            ...field,
            ...patch,
            placeholder: defaults.placeholder,
            options: defaults.options,
          };
        }

        return {
          ...field,
          ...patch,
        };
      }),
    );
  };

  const duplicateField = (field: BuilderField) => {
    const clone = {
      ...field,
      id: `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label: `${field.label} Copy`,
      order: Math.max(...fields.map((item) => item.order)) + 1,
    };
    setFields((current) => [...current, clone]);
    setSelectedFieldId(clone.id);
  };

  const deleteField = (id: string) => {
    setFields((current) => {
      const nextFields = current.filter((field) => field.id !== id);
      setSelectedFieldId(nextFields[0]?.id ?? "");
      return nextFields;
    });
  };

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find((item) => item.id === fieldId);

    if (!field) {
      return;
    }

    updateField(fieldId, {
      options: field.options.map((option, index) => (index === optionIndex ? value : option)),
    });
  };

  const addOption = (fieldId: string) => {
    const field = fields.find((item) => item.id === fieldId);

    if (!field) {
      return;
    }

    updateField(fieldId, {
      options: [...field.options, `Option ${field.options.length + 1}`],
    });
  };

  const deleteOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find((item) => item.id === fieldId);

    if (!field) {
      return;
    }

    updateField(fieldId, {
      options: field.options.filter((_, index) => index !== optionIndex),
    });
  };

  const logPublishedData = () => {
    if (!publishedData) {
      return;
    }

    onPublish(publishedData)
  };

  return (
    <div className="relative grid h-full min-h-0 grid-cols-1 bg-background lg:grid-cols-[18rem_minmax(0,1fr)_20rem]">
      <aside className="hidden min-h-0 overflow-y-auto border-r border-white/10 bg-surface-container-lowest/60 p-6 lg:block">
        <h2 className="mb-6 font-mono text-xs font-bold uppercase text-on-surface-variant">
          Components
        </h2>
        {(["Basic", "Choice"] as const).map((group) => (
          <section key={group} className="mb-8">
            <h3 className="mb-3 font-body text-sm font-medium text-on-surface-variant">{group}</h3>
            <div className="grid grid-cols-2 gap-3">
              {fieldTypes
                .filter((fieldType) => fieldType.group === group)
                .map((fieldType) => {
                  const Icon = fieldType.icon;

                  return (
                    <button
                      key={fieldType.type}
                      type="button"
                      onClick={() => addField(fieldType.type)}
                      className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-on-surface-variant transition-colors hover:border-primary/50 hover:bg-white/10 hover:text-primary"
                    >
                      <Icon className="size-5" />
                      <span className="font-body text-sm">{fieldType.label}</span>
                    </button>
                  );
                })}
            </div>
          </section>
        ))}
      </aside>

      <section className="min-h-0 overflow-y-auto bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="mx-auto w-full max-w-3xl px-5 py-10 md:px-8">
          <div className="mb-8">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mb-2 w-full border-none bg-transparent p-0 font-heading text-4xl font-bold text-foreground outline-none placeholder:text-on-surface-variant/50 focus:ring-0 md:text-5xl"
              placeholder="Form title"
            />
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-16 w-full resize-none border-none bg-transparent p-0 font-body text-lg text-on-surface-variant outline-none placeholder:text-on-surface-variant/40 focus:ring-0"
              placeholder="Add a description..."
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
            {fieldTypes.map((fieldType) => (
              <button
                key={fieldType.type}
                type="button"
                onClick={() => addField(fieldType.type)}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-on-surface-variant"
              >
                {fieldType.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {sortedFields.map((field) => {
              const isSelected = field.id === selectedField?.id;

              return (
                <article
                  key={field.id}
                  onClick={() => setSelectedFieldId(field.id)}
                  className={cn(
                    "group relative rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:border-white/20",
                    isSelected && "border-primary/60 shadow-[0_0_24px_rgba(157,216,80,0.12)]",
                  )}
                >
                  {isSelected && (
                    <div className="absolute -left-3 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs font-bold uppercase text-foreground">
                        {field.label}
                      </p>
                      {field.description && (
                        <p className="mt-1 font-body text-sm text-on-surface-variant">
                          {field.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          duplicateField(field);
                        }}
                        className="text-on-surface-variant transition-colors hover:text-primary"
                        aria-label="Duplicate field"
                      >
                        <Copy className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          deleteField(field.id);
                        }}
                        className="text-on-surface-variant transition-colors hover:text-destructive"
                        aria-label="Delete field"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>
                  <FieldPreview field={field} />
                  {field.required && (
                    <div className="mt-2 font-body text-xs font-semibold text-destructive">
                      Required
                    </div>
                  )}
                </article>
              );
            })}

            <button
              type="button"
              onClick={() => addField("text")}
              className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
            >
              <PlusCircle className="mb-2 size-6" />
              Add a field
            </button>
          </div>
        </div>
      </section>

      <aside className="min-h-0 overflow-y-auto border-l border-white/10 bg-surface-container-lowest/80 p-6">
        {selectedField ? (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold uppercase text-foreground">
                Field Properties
              </h2>
              <span className="rounded-md bg-primary/20 px-2 py-1 font-mono text-xs font-bold uppercase text-primary">
                {selectedField.type}
              </span>
            </div>
            <div className="space-y-5">
              <label className="block">
                <span className="mb-2 block font-body text-sm text-on-surface-variant">
                  Field Type
                </span>
                <select
                  value={selectedField.type}
                  onChange={(event) =>
                    updateField(selectedField.id, { type: event.target.value as FieldType })
                  }
                  className="w-full rounded-lg border border-white/10 bg-surface-container px-3 py-2 text-foreground outline-none focus:border-primary"
                >
                  {fieldTypes.map((fieldType) => (
                    <option key={fieldType.type} value={fieldType.type}>
                      {fieldType.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block font-body text-sm text-on-surface-variant">
                  Field Label
                </span>
                <input
                  value={selectedField.label}
                  onChange={(event) => updateField(selectedField.id, { label: event.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-surface-container px-3 py-2 text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-body text-sm text-on-surface-variant">
                  Placeholder
                </span>
                <input
                  value={selectedField.placeholder}
                  onChange={(event) =>
                    updateField(selectedField.id, { placeholder: event.target.value })
                  }
                  className="w-full rounded-lg border border-white/10 bg-surface-container px-3 py-2 text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-body text-sm text-on-surface-variant">
                  Description
                </span>
                <textarea
                  value={selectedField.description}
                  onChange={(event) =>
                    updateField(selectedField.id, { description: event.target.value })
                  }
                  className="min-h-24 w-full resize-none rounded-lg border border-white/10 bg-surface-container px-3 py-2 text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-body text-sm text-on-surface-variant">Order</span>
                <input
                  type="number"
                  min={1}
                  value={selectedField.order}
                  onChange={(event) =>
                    updateField(selectedField.id, { order: Number(event.target.value) || 1 })
                  }
                  className="w-full rounded-lg border border-white/10 bg-surface-container px-3 py-2 text-foreground outline-none focus:border-primary"
                />
              </label>
              <label className="flex items-center justify-between border-t border-white/10 pt-5">
                <span className="font-body text-sm font-semibold text-foreground">
                  Required Field
                </span>
                <input
                  type="checkbox"
                  checked={selectedField.required}
                  onChange={(event) =>
                    updateField(selectedField.id, { required: event.target.checked })
                  }
                  className="size-5 accent-primary"
                />
              </label>
              {(selectedField.type === "radio" || selectedField.type === "select") && (
                <div className="border-t border-white/10 pt-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="block font-body text-sm text-on-surface-variant">Options</span>
                    <button
                      type="button"
                      onClick={() => addOption(selectedField.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-white/10 px-2 py-1 font-body text-xs text-primary transition-colors hover:bg-white/5"
                    >
                      <PlusCircle className="size-3.5" />
                      Add
                    </button>
                  </div>
                  <div className="space-y-2">
                    {selectedField.options.map((option, index) => (
                      <div key={`${selectedField.id}-${index}`} className="flex items-center gap-2">
                        <input
                          value={option}
                          onChange={(event) =>
                            updateOption(selectedField.id, index, event.target.value)
                          }
                          className="min-w-0 flex-1 rounded-lg border border-white/10 bg-surface-container px-3 py-2 text-foreground outline-none focus:border-primary"
                          placeholder={`Option ${index + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => deleteOption(selectedField.id, index)}
                          className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-on-surface-variant transition-colors hover:border-destructive/40 hover:text-destructive"
                          aria-label={`Delete option ${index + 1}`}
                        >
                          <X className="size-4" />
                        </button>
                      </div>
                    ))}
                    {selectedField.options.length === 0 && (
                      <button
                        type="button"
                        onClick={() => addOption(selectedField.id)}
                        className="w-full rounded-lg border border-dashed border-white/10 px-3 py-3 text-sm text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        Add the first option
                      </button>
                    )}
                  </div>
                </div>
              )}
              <div className="border-t border-white/10 pt-5">
                <span className="mb-2 block font-body text-sm text-on-surface-variant">
                  Field Slug
                </span>
                <div className="flex overflow-hidden rounded-lg border border-white/10 bg-surface-container">
                  <span className="border-r border-white/10 bg-black/20 px-3 py-2 font-mono text-xs text-on-surface-variant">
                    key:
                  </span>
                  <input
                    readOnly
                    value={fieldSlug(selectedField.label)}
                    className="min-w-0 flex-1 bg-transparent px-3 py-2 font-mono text-xs text-foreground outline-none"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => deleteField(selectedField.id)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/40 px-4 py-3 font-body font-semibold text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="size-4" />
                Delete Field
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-center text-on-surface-variant">
            Add a field to edit its properties.
          </div>
        )}
      </aside>

      {publishedData && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md">
          <section className="flex max-h-[86vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/10 bg-surface-container-lowest shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-6">
              <div>
                <p className="font-mono text-xs font-bold uppercase text-primary">
                  Published Form Data
                </p>
                <h2 className="mt-2 font-heading text-2xl font-bold text-foreground">
                  {publishedData.title || "Untitled Form"}
                </h2>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {publishedData.fields.length} fields ready to publish
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPublishedData(null)}
                className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-white/10 text-on-surface-variant transition-colors hover:text-foreground"
                aria-label="Close published data"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="min-h-0 overflow-y-auto p-6">
              <div className="space-y-4">
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="font-mono text-xs font-bold uppercase text-on-surface-variant">
                    Title
                  </p>
                  <p className="mt-2 text-foreground">{publishedData.title || "Untitled Form"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="font-mono text-xs font-bold uppercase text-on-surface-variant">
                    Description
                  </p>
                  <p className="mt-2 text-foreground">
                    {publishedData.description || "No description"}
                  </p>
                </div>
                <div className="space-y-3">
                  {publishedData.fields.map((field) => (
                    <article
                      key={field.id}
                      className="rounded-lg border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-body font-semibold text-foreground">{field.label}</p>
                          <p className="mt-1 font-mono text-xs text-on-surface-variant">
                            {field.labelKey}
                          </p>
                        </div>
                        <span className="rounded-md bg-primary/20 px-2 py-1 font-mono text-xs font-bold uppercase text-primary">
                          {field.type}
                        </span>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <dt className="text-on-surface-variant">Order</dt>
                          <dd className="text-foreground">{field.order}</dd>
                        </div>
                        <div>
                          <dt className="text-on-surface-variant">Required</dt>
                          <dd className="text-foreground">{field.required ? "Yes" : "No"}</dd>
                        </div>
                      </dl>
                      {field.options.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm text-on-surface-variant">Options</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {field.options.map((option, index) => (
                              <span
                                key={`${field.id}-snapshot-${index}`}
                                className="rounded-full border border-white/10 px-2 py-1 text-xs text-foreground"
                              >
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-white/10 p-6">
              <button
                type="button"
                onClick={() => setPublishedData(null)}
                className="rounded-lg border border-white/10 px-4 py-2 font-body text-sm font-semibold text-on-surface-variant transition-colors hover:text-foreground"
              >
                Close
              </button>
              <button
                type="button"
                onClick={logPublishedData}
                className="rounded-lg bg-primary px-4 py-2 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Log data to console
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
