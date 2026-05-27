import z from "zod";

export const createFormFieldInput= z.object({
  label: z.string().describe("The label of the field"),
  type: z.string().describe("The type of the field"),
  placeholder: z.string().describe("The placeholder of the field"),
  description: z.string().default("").describe("The description of the field"),
  order: z.number().describe("The order of the field"),
  required: z.boolean().default(false).describe("Whether the field is required"),
}) 
export type CreateFormFieldInputType = z.infer<typeof createFormFieldInput>;

export const updateFormFieldInput= z.object({
  id: z.string().describe("The id of the field"),
  label: z.string().describe("The label of the field"),
  type: z.string().describe("The type of the field"),
  placeholder: z.string().describe("The placeholder of the field"),
  description: z.string().default("").describe("The description of the field"),
  order: z.number().describe("The order of the field"),
  required: z.boolean().default(false).describe("Whether the field is required"),
}) 
export type UpdateFormFieldInputType = z.infer<typeof updateFormFieldInput>;