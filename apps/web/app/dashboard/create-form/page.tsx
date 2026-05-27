"use client";

import { Eye, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "~/components/dashboard-shell";
import { FormBuilder, FormSnapshot } from "~/components/form-builder";
import { useCreateForm, useCreateFormField } from "~/hooks/api/form";

const CreateForm = () => {
  const router = useRouter();
  const [publishRequest, setPublishRequest] = useState(0);
  const [previewRequest, setPreviewRequest] = useState(0);
  const { createFormAsync, isPending: isCreatingForm } = useCreateForm();
  const { createFormFieldAsync, isPending: isCreatingField } = useCreateFormField();

  const handlePublish = useCallback(
    async (snapshot: FormSnapshot) => {
      try {
        const form = await createFormAsync({
          title: snapshot.title || "Untitled Form",
          description: snapshot.description || "No description",
        });

        await Promise.all(
          snapshot.fields.map((field) =>
            createFormFieldAsync({
              formId: form.id,
              label: field.label,
              type: field.type,
              placeholder: field.placeholder,
              description: field.description,
              order: field.order,
              required: field.required,
              options: field.options,
            }),
          ),
        );

        toast.success("Form saved", {
          position: "top-right",
        });
        router.push(`/dashboard/forms/${form.id}`);
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unable to save form";
        toast.error(message, {
          position: "top-right",
        });
        throw error;
      }
    },
    [createFormAsync, createFormFieldAsync, router],
  );

  const isSaving = isCreatingForm || isCreatingField;

  return (
    <DashboardShell
      title="Create Form"
      action={
        <>
          <button
            type="button"
            onClick={() => setPreviewRequest((current) => current + 1)}
            className="inline-flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/5 hover:text-primary"
            aria-label="Preview form"
          >
            <Eye className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => setPublishRequest((current) => current + 1)}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 font-body text-sm font-bold text-primary-foreground shadow-[0_0_18px_rgba(157,216,80,0.2)] transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Rocket className="size-4" />
            {isSaving ? "Saving" : "Publish"}
          </button>
        </>
      }
    >
      <FormBuilder
        onPublish={handlePublish}
        previewRequest={previewRequest}
        publishRequest={publishRequest}
      />
    </DashboardShell>
  );
};

export default CreateForm;
