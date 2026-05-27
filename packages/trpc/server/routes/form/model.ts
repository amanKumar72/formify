import z from "zod";

export const createFormInputModel = z.object({
  title: z.string().min(1).describe("The title of the form"),
  description: z.string().min(1).describe("The description of the form"),
})
export const createFormOutputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
})

export const getFormInputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
})

export const getFormOutputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
  title: z.string().describe("The title of the form"),
  createdBy: z.string().describe("The unique identifier of the user who created the form"),
  description: z.string().nullable().describe("The description of the form"),
  createdAt: z.date().nullable().describe("The date and time when the form was created"),
  updatedAt: z.date().nullable().describe("The date and time when the form was last updated"),
})

export const updateFormInputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
  title: z.string().describe("The title of the form"),
  description: z.string().nullable().describe("The description of the form"),
})
export const updateFormOutputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
  title: z.string().describe("The title of the form"),
  createdBy: z.string().describe("The unique identifier of the user who created the form"),
  description: z.string().nullable().describe("The description of the form"),
  createdAt: z.date().nullable().describe("The date and time when the form was created"),
  updatedAt: z.date().nullable().describe("The date and time when the form was last updated"),
})
export const deleteFormInputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
})
export const deleteFormOutputModel = z.object({
  success: z.boolean().describe("Whether the form was deleted successfully"),
})