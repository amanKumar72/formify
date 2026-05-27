import { trpc } from "~/trpc/client";

// form
export const useCreateForm = () => {
    const { mutate: createForm, mutateAsync: createFormAsync, isSuccess, isError, error,isIdle, isPending, data } = trpc.form.createForm.useMutation();
    return {
        createForm,
        createFormAsync,
        data,
        isSuccess,
        isError,
        error,
        isIdle,
        isPending,
    }
}

export const useGetFormById = (formId: string) => {
    const { data: form, error: formAsync, isSuccess, isError, error, isPending } = trpc.form.getFormById.useQuery({ id: formId });
    return {
        form,
        formAsync,
        isSuccess,
        isError,
        error,
        isPending,
    }
}

export const useUpdateForm = () => {
    const { mutate: updateForm, mutateAsync: updateFormAsync, isSuccess, isError, error,isIdle, isPending } = trpc.form.updateForm.useMutation();
    return {
        updateForm,
        updateFormAsync,
        isSuccess,
        isError,
        error,
        isIdle,
        isPending,
    }
}

export const useDeleteForm = () => {
    const { mutate: deleteForm, mutateAsync: deleteFormAsync, isSuccess, isError, error,isIdle, isPending } = trpc.form.deleteForm.useMutation();
    return {
        deleteForm,
        deleteFormAsync,
        isSuccess,
        isError,
        error,
        isIdle,
        isPending,
    }
}

export const useGetMyAllForms = () => {
    const { data: allForms, isSuccess, isError, error, isPending , isLoading} = trpc.form.getMyForms.useQuery();
    return {
        allForms,
        error,
        isSuccess,
        isError,
        isPending,
        isLoading,
    }
}

// fields
export const useCreateFormField = () => {
    const { mutate: createFormField, mutateAsync: createFormFieldAsync, isSuccess, isError, error,isIdle, isPending } = trpc.form.createFormField.useMutation();
    return {
        createFormField,
        createFormFieldAsync,
        isSuccess,
        isError,
        error,
        isIdle,
        isPending,
    }
}

export const useGetFormFields = (formId: string) => {
    const { data: formFields, isSuccess, isError, error, isPending } = trpc.form.getFormFields.useQuery({ id: formId });
    return {
        formFields,
        error,
        isSuccess,
        isError,
        isPending,
    }
}

export const useUpdateFormField = () => {
    const { mutate: updateFormField, mutateAsync: updateFormFieldAsync, isSuccess, isError, error,isIdle, isPending } = trpc.form.updateFormField.useMutation();
    return {
        updateFormField,
        updateFormFieldAsync,
        isSuccess,
        isError,
        error,
        isIdle,
        isPending,
    }
}

export const useDeleteFormField = () => {
    const { mutate: deleteFormField, mutateAsync: deleteFormFieldAsync, isSuccess, isError, error,isIdle, isPending } = trpc.form.deleteFormField.useMutation();
    return {
        deleteFormField,
        deleteFormFieldAsync,
        isSuccess,
        isError,
        error,
        isIdle,
        isPending,
    }
}

export const useGetFormFieldById = (formId: string, formFieldId: string) => {
    const { data: formField, isSuccess, isError, error, isPending } = trpc.form.getFormField.useQuery({ id: formId, fieldId: formFieldId });
    return {
        formField,
        error,
        isSuccess,
        isError,
        isPending,
    }
}

export const useGetFormFieldTypeOptions = () => {
    const { data: typeOptions, isSuccess, isError, error, isPending } = trpc.form.getFormFieldTypeOptions.useQuery();
    return {
        typeOptions,
        error,
        isSuccess,
        isError,
        isPending,
    }
}

// submissions
export const useSubmitForm = () => {
    const { mutate: submitForm, mutateAsync: submitFormAsync, isSuccess, isError, error,isIdle, isPending } = trpc.form.submitForm.useMutation();
    return {
        submitForm,
        submitFormAsync,
        isSuccess,
        isError,
        error,
        isIdle,
        isPending,
    }
}

export const useGetAllFormSubmissions = () => {
    const { data: allSubmissions, isSuccess, isError, error, isPending, isLoading } = trpc.form.getFormSubmissions.useQuery();
    return {
        allSubmissions,
        error,
        isSuccess,
        isError,
        isPending,
        isLoading,
    }
}
export const useGetAllFormSubmissionsByFormId = (formId: string) => {
    const { data: allSubmissions, isSuccess, isError, error, isPending, isLoading } = trpc.form.getFormSubmissionsByFormId.useQuery({ id: formId });
    return {
        allSubmissions,
        error,
        isSuccess,
        isError,
        isPending,
        isLoading
    }
}





