import { trpc } from "~/trpc/client";

export const useMyForms = () => trpc.form.getMyForms.useQuery();

export const useGetMyAllForms = () => {
  const query = trpc.form.getMyForms.useQuery();

  return {
    ...query,
    allForms: query.data,
  };
};

export const useFormById = (id: string) =>
  trpc.form.getFormById.useQuery(
    { id },
    {
      enabled: Boolean(id),
      retry: false,
    },
  );

export const useGetFormById = (id: string) => {
  const query = useFormById(id);

  return {
    ...query,
    form: query.data,
  };
};

export const useFormFields = (id: string) =>
  trpc.form.getFormFields.useQuery(
    { id },
    {
      enabled: Boolean(id),
      retry: false,
    },
  );

export const useGetFormFields = (id: string) => {
  const query = useFormFields(id);

  return {
    ...query,
    formFields: query.data,
  };
};

export const useFormSubmissions = () => trpc.form.getFormSubmissions.useQuery(undefined);

export const useGetAllFormSubmissions = () => {
  const query = useFormSubmissions();

  return {
    ...query,
    allSubmissions: query.data,
  };
};

export const useFormSubmissionsByFormId = (id: string) =>
  trpc.form.getFormSubmissionsByFormId.useQuery(
    { id },
    {
      enabled: Boolean(id),
      retry: false,
    },
  );

export const useGetAllFormSubmissionsByFormId = (id: string) => {
  const query = useFormSubmissionsByFormId(id);

  return {
    ...query,
    allSubmissions: query.data,
  };
};

export const useCreateForm = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.form.createForm.useMutation({
    onSuccess: async () => {
      await utils.form.getMyForms.invalidate();
    },
  });

  return {
    ...mutation,
    createForm: mutation.mutate,
    createFormAsync: mutation.mutateAsync,
  };
};

export const useUpdateForm = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.form.updateForm.useMutation({
    onSuccess: async () => {
      await utils.form.getMyForms.invalidate();
    },
  });

  return {
    ...mutation,
    updateForm: mutation.mutate,
    updateFormAsync: mutation.mutateAsync,
  };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();
  const mutation = trpc.form.deleteForm.useMutation({
    onSuccess: async () => {
      await utils.form.getMyForms.invalidate();
    },
  });

  return {
    ...mutation,
    deleteForm: mutation.mutate,
    deleteFormAsync: mutation.mutateAsync,
  };
};

export const useCreateFormField = () => {
  const mutation = trpc.form.createFormField.useMutation();

  return {
    ...mutation,
    createFormField: mutation.mutate,
    createFormFieldAsync: mutation.mutateAsync,
  };
};

export const useUpdateFormField = () => {
  const mutation = trpc.form.updateFormField.useMutation();

  return {
    ...mutation,
    updateFormField: mutation.mutate,
    updateFormFieldAsync: mutation.mutateAsync,
  };
};

export const useDeleteFormField = () => {
  const mutation = trpc.form.deleteFormField.useMutation();

  return {
    ...mutation,
    deleteFormField: mutation.mutate,
    deleteFormFieldAsync: mutation.mutateAsync,
  };
};

export const useSubmitForm = () => {
  const mutation = trpc.form.submitForm.useMutation();

  return {
    ...mutation,
    submitForm: mutation.mutate,
    submitFormAsync: mutation.mutateAsync,
  };
};
