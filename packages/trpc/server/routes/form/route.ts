import {
  cloudinaryUploadService,
  formFieldService,
  formService,
  formSubmissionService,
} from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFormInputModel,
  createFormOutputModel,
  deleteFormInputModel,
  deleteFormOutputModel,
  getFormFieldsInputModel,
  getFormFieldsOutputModel,
  getFormInputModel,
  getFormOutputModel,
  updateFormInputModel,
  updateFormOutputModel,
  createFormFieldInputModel,
  createFormFieldOutputModel,
  updateFormFieldInputModel,
  updateFormFieldOutputModel,
  deleteFormFieldInputModel,
  deleteFormFieldOutputModel,
  getFormFieldInputModel,
  getFormFieldOutputModel,
  getFormFieldTypeOptionsOutputModel,
  getAllFormSubmissionsInputModel,
  getAllFormSubmissionsOutputModel,
  submitFormInputModel,
  submitFormOutputModel,
  uploadSubmissionFileInputModel,
  uploadSubmissionFileOutputModel,
  getAllSubmissionsInputModel,
} from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");
const normalizeOption = (option: unknown) => {
  if (typeof option === "string") {
    try {
      const parsed = JSON.parse(option) as unknown;
      return typeof parsed === "string" ? parsed : option;
    } catch {
      return option;
    }
  }

  if (typeof option === "number" || typeof option === "boolean") {
    return String(option);
  }

  if (option && typeof option === "object") {
    const record = option as Record<string, unknown>;
    if (typeof record.label === "string") {
      return record.label;
    }
    if (typeof record.value === "string") {
      return record.value;
    }
  }

  return null;
};

const normalizeFieldOptions = <T extends { options: unknown[] | null }>(field: T) => ({
  ...field,
  options: Array.isArray(field.options)
    ? field.options.map(normalizeOption).filter((option): option is string => Boolean(option))
    : [],
});

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/"),
        tags: TAGS,
        summary: "Create a new form",
        protect: true,
      },
    })
    .input(createFormInputModel)
    .output(createFormOutputModel)
    .mutation(async ({ ctx, input }) => {
      const { title, description } = input;
      const { id } = await formService.createForm(
        {
          title,
          description,
        },
        ctx.user.id,
      );
      return {
        id,
      };
    }),
  getFormById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/:id"),
        tags: TAGS,
        summary: "Get the info of a form",
        protect: false,
      },
    })
    .input(getFormInputModel)
    .output(getFormOutputModel)
    .query(async ({ ctx, input }) => {
      const { id: formId } = input;
      const { id, title, createdBy, description, createdAt, updatedAt } =
        await formService.getFormById(formId);
      return {
        id,
        title,
        createdBy,
        description,
        createdAt,
        updatedAt,
      };
    }),
  updateForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/:id"),
        tags: TAGS,
        summary: "Update a form",
        protect: true,
      },
    })
    .input(updateFormInputModel)
    .output(updateFormOutputModel)
    .mutation(async ({ ctx, input }) => {
      const { id, title, description } = input;
      const form = await formService.updateForm(
        {
          id,
          title,
          description,
        },
        ctx.user.id,
      );
      return {
        id,
        ...form,
      };
    }),
  deleteForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/:id"),
        tags: TAGS,
        summary: "Delete a form",
        protect: true,
      },
    })
    .input(deleteFormInputModel)
    .output(deleteFormOutputModel)
    .mutation(async ({ ctx, input }) => {
      const { id: formId } = input;
      const { success } = await formService.deleteForm(formId, ctx.user.id);
      return {
        success,
      };
    }),
  getMyForms: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/"),
        tags: TAGS,
        summary: "Get the forms created by the user",
        protect: true,
      },
    })
    .output(updateFormOutputModel.array())
    .query(async ({ ctx }) => {
      const forms = await formService.getMyForms(ctx.user.id);
      return forms;
    }),
  getFormFields: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/:id/fields"),
        tags: TAGS,
        summary: "Get the form fields of a form",
        protect: false,
      },
    })
    .input(getFormFieldsInputModel)
    .output(getFormFieldsOutputModel)
    .query(async ({ input }) => {
      const { id: formId } = input;
      const formFields = await formFieldService.getFormFields(formId);
      return formFields.map(normalizeFieldOptions);
    }),
  createFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/:id/fields"),
        tags: TAGS,
        summary: "Create a form field",
        protect: true,
      },
    })
    .input(createFormFieldInputModel)
    .output(createFormFieldOutputModel)
    .mutation(async ({ ctx, input }) => {
      const { formId, label, type, placeholder, description, order, required, options } = input;
      const field = await formFieldService.createFormField(formId, ctx.user.id, {
        label,
        type,
        placeholder: placeholder || "",
        description: description || "",
        required: required || false,
        order: order || 0,
        options: options || [],
      });
      return normalizeFieldOptions(field);
    }),
  updateFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "PUT",
        path: getPath("/:id/fields/:fieldId"),
        tags: TAGS,
        summary: "Update a form field",
        protect: true,
      },
    })
    .input(updateFormFieldInputModel)
    .output(updateFormFieldOutputModel)
    .mutation(async ({ ctx, input }) => {
      const {
        formId,
        id: fieldId,
        label,
        type,
        placeholder,
        description,
        order,
        required,
        options,
      } = input;
      const field = await formFieldService.updateFormField(formId, ctx.user.id, {
        id: fieldId,
        label,
        type,
        placeholder: placeholder || "",
        description: description || "",
        required: required || false,
        order: order || 0,
        options: options || [],
      });
      return normalizeFieldOptions(field);
    }),
  deleteFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/:id/fields/:fieldId"),
        tags: TAGS,
        summary: "Delete a form field",
        protect: true,
      },
    })
    .input(deleteFormFieldInputModel)
    .output(deleteFormFieldOutputModel)
    .mutation(async ({ ctx, input }) => {
      const { fieldId, id: formId } = input;
      console.log("In procedure ", fieldId, formId);
      const { success } = await formFieldService.deleteFormField(formId, ctx.user.id, fieldId);
      return {
        success,
      };
    }),
  getFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/:id/fields/:fieldId"),
        tags: TAGS,
        summary: "Get a form field",
        protect: true,
      },
    })
    .input(getFormFieldInputModel)
    .output(getFormFieldOutputModel)
    .query(async ({ input }) => {
      const { id: formId, fieldId } = input;
      const field = await formFieldService.getFormField(formId, fieldId);
      return normalizeFieldOptions(field);
    }),
  getFormFieldTypeOptions: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/fields/type-options"),
        tags: TAGS,
        summary: "Get the form field type options",
        protect: false,
      },
    })
    .output(getFormFieldTypeOptionsOutputModel)
    .query(async () => {
      const typeOptions = await formFieldService.getFormFieldTypeOptions();
      return typeOptions;
    }),
  getFormSubmissions: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/:id/submissions"),
        tags: TAGS,
        summary: "Get the form submissions of a form",
        protect: true,
      },
    })
    .input(getAllSubmissionsInputModel)
    .output(getAllFormSubmissionsOutputModel)
    .query(async ({ ctx }) => {
      const submissions = await formSubmissionService.getAllFormSubmissions(ctx.user.id);
      return submissions;
    }),
  getFormSubmissionsByFormId: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/:id/:formId/submissions"),
        tags: TAGS,
        summary: "Get the form submissions of a form",
        protect: true,
      },
    })
    .input(getAllFormSubmissionsInputModel)
    .output(getAllFormSubmissionsOutputModel)
    .query(async ({ ctx, input }) => {
      const { id: formId } = input;
      const submissions = await formSubmissionService.getAllFormSubmissionsByFormId(
        formId,
        ctx.user.id,
      );
      return submissions;
    }),
  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/:id/submit"),
        tags: TAGS,
        summary: "Submit a form",
        protect: false,
      },
    })
    .input(submitFormInputModel)
    .output(submitFormOutputModel)
    .mutation(async ({ ctx, input }) => {
      const { id: formId, submittedData } = input;
      const { success } = await formSubmissionService.submitFormByUser({
        formId,
        userId: ctx.user?.id || null,
        ip: ctx.ip || "",
        userAgent: ctx.userAgent || "",
        submittedData,
      });
      return {
        success,
      };
    }),
  uploadSubmissionFile: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/:formId/submission-file"),
        tags: TAGS,
        summary: "Upload a file for a form submission",
        protect: false,
      },
    })
    .input(uploadSubmissionFileInputModel)
    .output(uploadSubmissionFileOutputModel)
    .mutation(async ({ input }) => {
      await formService.getFormById(input.formId);
      const uploadedFile = await cloudinaryUploadService.uploadFile({
        dataUrl: input.dataUrl,
        filename: input.filename,
        folder: `forms/${input.formId}/submissions`,
      });

      return {
        url: uploadedFile.url,
        publicId: uploadedFile.publicId,
        filename: uploadedFile.originalFilename,
        resourceType: uploadedFile.resourceType,
      };
    }),
});
