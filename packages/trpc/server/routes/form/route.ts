import { formService, userService } from "../../services";
import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import {
  createFormInputModel,
  createFormOutputModel,
  deleteFormInputModel,
  deleteFormOutputModel,
  getFormInputModel,
  getFormOutputModel,
  updateFormInputModel,
  updateFormOutputModel,
} from "./model";

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

});
