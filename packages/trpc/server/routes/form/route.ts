import { formFieldService, formService, userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createFormInputModel, createFormOutputModel, deleteFormInputModel, deleteFormOutputModel, getFormFieldsInputModel, getFormFieldsOutputModel, getFormInputModel, getFormOutputModel, updateFormInputModel, updateFormOutputModel, createFormFieldInputModel, createFormFieldOutputModel, updateFormFieldInputModel, updateFormFieldOutputModel, deleteFormFieldInputModel, deleteFormFieldOutputModel, getFormFieldInputModel, getFormFieldOutputModel, getFormFieldTypeOptionsOutputModel } from "./model";

const TAGS = ["Form"];
const getPath = generatePath("/form");

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
  getFormById: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/:id"),
        tags: TAGS,
        summary: "Get the info of a form",
        protect: true,
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
    getFormFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/:id/fields"),
        tags: TAGS,
        summary: "Get the form fields of a form",
        protect: true,
      },
    })
    .input(getFormFieldsInputModel)
    .output(getFormFieldsOutputModel)
    .query(
      async ({ input }) => {
        const { id: formId } = input;
        const formFields = await formFieldService.getFormFields(formId);
        return formFields;
      },
    ),
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
      const { formId, label, type, placeholder, description, order, required } = input;
      const { id } = await formFieldService.createFormField(
        formId,
        ctx.user.id,
        {
          label,
          type,
          placeholder: placeholder || "",
          description: description || "",
          required: required || false,
          order: order || 0,
        },
      );
      return {
        id,
      };
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
      const { formId, id:fieldId, label, type, placeholder, description, order, required } = input;
      const field = await formFieldService.updateFormField(
        formId,
        ctx.user.id,
        {
          id: fieldId,
          label,
          type,
          placeholder: placeholder || "",
          description: description || "",
          required: required || false,
          order: order || 0,
        },
      );
      return {
        id: fieldId
      };
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
      const { id: formId, id:fieldId } = input;
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
    .query(
      async ({ input }) => {
        const { id: formId,fieldId } = input;
        const field = await formFieldService.getFormField(formId, fieldId);
        return field;
      },
    ),
    getFormFieldTypeOptions: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/:id/fields/type-options"),
        tags: TAGS,
        summary: "Get the form field type options",
        protect: true,
      },
    })
    .output(getFormFieldTypeOptionsOutputModel)
    .query(async () => {
      const typeOptions = await formFieldService.getFormFieldTypeOptions();
      return typeOptions;
    }),
});
