"use client";

import { Rocket } from "lucide-react";
import { useState } from "react";
import { DashboardShell } from "~/components/dashboard-shell";
import { BuilderField, FormBuilder, FormSnapshot } from "~/components/form-builder";
import { useCreateForm, useCreateFormField } from "~/hooks/api/form";

const CreateForm = () => {
  const [publishRequest, setPublishRequest] = useState(0);
  const { createForm, data } = useCreateForm();
  const { createFormField } = useCreateFormField();

  const handleSubmit = async (formSnapshot: FormSnapshot) => {
    createForm(formSnapshot);
    console.log(data)
    formSnapshot.fields.forEach((field: BuilderField & { labelKey: string }) => {
      createFormField({
        formId: data?.id || "",
        label: field.label,
        type: field.type,
        placeholder: field.placeholder,
        description: field.description,
        order: field.order,
        required: field.required,
      });
    });
  }
  return (
    <DashboardShell
      title="Create Form"
      action={
        <button
          type="button"
          onClick={() => setPublishRequest((current) => current + 1)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 font-body text-sm font-bold text-primary-foreground shadow-[0_0_18px_rgba(157,216,80,0.2)] transition-colors hover:bg-primary/90"
        >
          <Rocket className="size-4" />
          Publish
        </button>
      }
    >
      <FormBuilder onPublish={handleSubmit} publishRequest={publishRequest} />
    </DashboardShell>
  );
};

export default CreateForm;
