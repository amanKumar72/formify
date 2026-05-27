import z from "zod";

export const createFormInput= z.object({
  title: z.string().min(1).describe("The name of the form"),
  description: z.string().nullable().describe("The description of the form"),
}) 
export type CreateFormInputType = z.infer<typeof createFormInput>;

export const updateFormInput= z.object({
  id: z.string().describe("The id of the form"),
  title: z.string().min(1).describe("The name of the form"),
  description: z.string().nullable().describe("The description of the form"),
}) 
export type updateFormInputType = z.infer<typeof updateFormInput>;
