import z from "zod";

export const uploadedFileValueModel = z.object({
  url: z.string().url().describe("The uploaded file URL"),
  publicId: z.string().describe("The Cloudinary public id"),
  filename: z.string().describe("The original filename"),
  resourceType: z.string().describe("The Cloudinary resource type"),
  mimeType: z.string().optional().describe("The uploaded file MIME type"),
});

export const submittedFieldValueModel = z.union([z.string(), uploadedFileValueModel]);

export const createFormSubmissionInput = z.object({
  formId: z.string().describe("The id of the form"),
  userId: z.string().nullable().describe("The id of the user"),
  ip: z.string().describe("The ip of the user"),
  userAgent: z.string().describe("The user agent of the user"),
  submittedData: z
    .array(
      z.object({
        labelKey: z.string().describe("The label key of the field"),
        value: submittedFieldValueModel.describe("The value of the field"),
      }),
    )
    .describe("The submitted data"),
});
export type CreateFormSubmissionInputType = z.infer<typeof createFormSubmissionInput>;
