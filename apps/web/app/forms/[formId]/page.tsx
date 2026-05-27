"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { FormRenderer } from "~/components/form-renderer";
import {
  useGetFormById,
  useGetFormFields,
  useSubmitForm,
  useUploadSubmissionFile,
} from "~/hooks/api/form";
import { fileToDataUrl, type SubmittedFormField } from "~/lib/file-upload";
import { toBuilderField } from "~/lib/form-utils";

const PublicFormPage = () => {
  const params = useParams<{ formId: string }>();
  const formId = params.formId;
  const { form, isLoading: isFormLoading } = useGetFormById(formId);
  const { formFields, isLoading: areFieldsLoading } = useGetFormFields(formId);
  const { submitFormAsync, isPending } = useSubmitForm();
  const { uploadSubmissionFileAsync, isPending: isUploading } = useUploadSubmissionFile();

  const handleSubmit = async (submittedData: SubmittedFormField[]) => {
    try {
      await submitFormAsync({
        id: formId,
        submittedData,
      });
      toast.success("Form submitted", {
        position: "top-right",
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unable to submit form";
      toast.error(message, {
        position: "top-right",
      });
    }
  };

  const handleFileUpload = async (file: File) => {
    const dataUrl = await fileToDataUrl(file);

    return uploadSubmissionFileAsync({
      formId,
      dataUrl,
      filename: file.name,
    });
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 font-body text-foreground md:px-8">
      <header className="mx-auto mb-10 flex max-w-3xl items-center justify-between">
        <Link href="/" className="font-heading text-2xl font-bold text-primary">
          FormFlow
        </Link>
      </header>
      {isFormLoading || areFieldsLoading || !form ? (
        <div className="mx-auto max-w-3xl rounded-xl border border-white/10 bg-white/5 p-8 text-on-surface-variant">
          Loading form...
        </div>
      ) : (
        <FormRenderer
          title={form.title}
          description={form.description}
          fields={(formFields ?? []).map(toBuilderField)}
          isSubmitting={isPending || isUploading}
          onSubmit={handleSubmit}
          onFileUpload={handleFileUpload}
        />
      )}
    </main>
  );
};

export default PublicFormPage;
