"use client";

import { Save, Share2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "~/components/dashboard-shell";
import { FormBuilder, FormSnapshot } from "~/components/form-builder";
import { ShareFormDialog } from "~/components/share-form-dialog";
import {
  useCreateFormField,
  useDeleteFormField,
  useGetFormById,
  useGetFormFields,
  useUpdateForm,
  useUpdateFormField,
} from "~/hooks/api/form";
import { getPublicFormLink, toBuilderField } from "~/lib/form-utils";
import { trpc } from "~/trpc/client";

const EditForm = () => {
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const [saveRequest, setSaveRequest] = useState(0);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const { form, isLoading: isFormLoading } = useGetFormById(formId);
  const { formFields, isLoading: areFieldsLoading } = useGetFormFields(formId);
  const { updateFormAsync, isPending: isUpdatingForm } = useUpdateForm();
  const { updateFormFieldAsync, isPending: isUpdatingField } = useUpdateFormField();
  const { createFormFieldAsync, isPending: isCreatingField } = useCreateFormField();
  const { deleteFormFieldAsync, isPending: isDeletingField } = useDeleteFormField();
  const utils = trpc.useUtils();
  const fields = useMemo(() => (formFields ?? []).map(toBuilderField), [formFields]);
  const isSaving = isUpdatingForm || isUpdatingField || isCreatingField || isDeletingField;

  const handleSave = useCallback(
    async (snapshot: FormSnapshot) => {
      await updateFormAsync({
        id: formId,
        title: snapshot.title || "Untitled Form",
        description: snapshot.description || null,
      });

      const snapshotIds = new Set(snapshot.fields.map((field) => field.id));
      const removedFields = (formFields ?? []).filter((field) => !snapshotIds.has(field.id));

      const savedFields = await Promise.all(
        snapshot.fields.map((field) => {
          const payload = {
            formId,
            label: field.label,
            type: field.type,
            placeholder: field.placeholder,
            description: field.description,
            order: field.order,
            required: field.required,
            options: field.options,
          };

          if (formFields?.some((item) => item.id === field.id)) {
            return updateFormFieldAsync({
              id: field.id,
              ...payload,
            }).then(() => field);
          }

          return createFormFieldAsync(payload).then((createdField) => ({
            ...field,
            id: createdField.id,
          }));
        }),
      );

      await Promise.all(
        removedFields.map((field) =>
          deleteFormFieldAsync({
            fieldId: field.id,
            id: formId,
          }),
        ),
      );

      await utils.form.getFormFields.invalidate({ id: formId });
      await utils.form.getMyForms.invalidate();

      toast.success("Form updated", {
        position: "top-right",
      });

      return {
        ...snapshot,
        fields: savedFields,
      };
    },
    [
      createFormFieldAsync,
      deleteFormFieldAsync,
      formFields,
      formId,
      updateFormAsync,
      updateFormFieldAsync,
      utils.form.getFormFields,
      utils.form.getMyForms,
    ],
  );

  return (
    <DashboardShell
      title="Edit Form"
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
          <button
            type="button"
            onClick={() => setSaveRequest((current) => current + 1)}
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 font-body text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            <Save className="size-4" />
            {isSaving ? "Saving" : "Save"}
          </button>
        </>
      }
    >
      {isFormLoading || areFieldsLoading || !form ? (
        <main className="flex h-full items-center justify-center text-on-surface-variant">
          Loading form...
        </main>
      ) : (
        <FormBuilder
          initialDescription={form.description ?? ""}
          initialFields={fields}
          initialTitle={form.title}
          onPublish={handleSave}
          publishRequest={saveRequest}
        />
      )}
      <ShareFormDialog
        open={isShareOpen}
        link={getPublicFormLink(formId)}
        onClose={() => setIsShareOpen(false)}
      />
    </DashboardShell>
  );
};

export default EditForm;
