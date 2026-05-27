import z from "zod";

export const createFormSubmissionInput= z.object({
  formId: z.string().describe("The id of the form"),
  userId: z.string().nullable().describe("The id of the user"),
  ip: z.string().describe("The ip of the user"),
  userAgent: z.string().describe("The user agent of the user"),
  submittedData: z.array(z.object({
    labelKey: z.string().describe("The label key of the field"),
    value: z.string().describe("The value of the field"),
  })).describe("The submitted data"),
}) 
export type CreateFormSubmissionInputType = z.infer<typeof createFormSubmissionInput>;
