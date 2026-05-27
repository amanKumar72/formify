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

export const getFormFieldsInputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
})
export const getFormFieldsOutputModel = z.array(z.object({
  id: z.string().describe("The unique identifier of the form field"),
  formId: z.string().describe("The unique identifier of the form"),
  label: z.string().describe("The label of the form field"),
  labelKey: z.string().describe("The label key of the form field"),
  type: z.string().describe("The type of the form field"),
  placeholder: z.string().nullable().describe("The placeholder of the form field"),
  description: z.string().nullable().describe("The description of the form field"),
  order: z.number().nullable().default(0).describe("The order of the form field"),
  required: z.boolean().nullable().default(false).describe("Whether the form field is required"),
}))

export const createFormFieldInputModel = z.object({
  formId: z.string().describe("The unique identifier of the form"),
  label: z.string().describe("The label of the form field"),
  type: z.string().describe("The type of the form field"),
  placeholder: z.string().nullable().describe("The placeholder of the form field"),
  description: z.string().nullable().describe("The description of the form field"),
  order: z.number().nullable().default(0).describe("The order of the form field"),
  required: z.boolean().nullable().default(false).describe("Whether the form field is required"),
})
export const createFormFieldOutputModel = z.object({
  id: z.string().describe("The unique identifier of the form field"),
})

export const updateFormFieldInputModel = z.object({
  formId: z.string().describe("The unique identifier of the form"),
  id: z.string().describe("The unique identifier of the form field"),
  label: z.string().describe("The label of the form field"),
  type: z.string().describe("The type of the form field"),
  placeholder: z.string().nullable().describe("The placeholder of the form field"),
  description: z.string().nullable().describe("The description of the form field"),
  order: z.number().nullable().default(0).describe("The order of the form field"),
  required: z.boolean().nullable().default(false).describe("Whether the form field is required"),
})
export const updateFormFieldOutputModel = z.object({
  id: z.string().describe("The unique identifier of the form field"),
})

export const deleteFormFieldInputModel = z.object({
  id: z.string().describe("The unique identifier of the form field"),
})
export const deleteFormFieldOutputModel = z.object({
  success: z.boolean().describe("Whether the form field was deleted successfully"),
})

export const getFormFieldInputModel = z.object({
  id: z.string().describe("The unique identifier of the form field"),
  fieldId: z.string().describe("The unique identifier of the form field"),
})
export const getFormFieldOutputModel = z.object({
  id: z.string().describe("The unique identifier of the form field"),
  formId: z.string().describe("The unique identifier of the form"),
  label: z.string().describe("The label of the form field"),
  labelKey: z.string().describe("The label key of the form field"),
  type: z.string().describe("The type of the form field"),
  placeholder: z.string().nullable().describe("The placeholder of the form field"),
  description: z.string().nullable().describe("The description of the form field"),
  order: z.number().nullable().default(0).describe("The order of the form field"),
  required: z.boolean().nullable().default(false).describe("Whether the form field is required"),
})

export const getFormFieldTypeOptionsOutputModel = z.array(z.string()).describe("The form field type options")

export const getAllFormSubmissionsInputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
  page: z.number().nullable().default(1).describe("The page number"),
  pageSize: z.number().nullable().default(10).describe("The page size"),
})
export const getAllFormSubmissionsOutputModel = z.array(z.object({
  id: z.string().describe("The unique identifier of the form submission"),
  formId: z.string().describe("The unique identifier of the form"),
  userId: z.string().nullable().describe("The unique identifier of the user"),
  ip: z.string().describe("The ip of the user"),
  userAgent: z.string().nullable().describe("The user agent of the user"),
  submittedData: z.unknown().describe("The submitted data"),
  createdAt: z.date().nullable().describe("The date and time when the form submission was created"),
}))

export const submitFormInputModel = z.object({
  id: z.string().describe("The unique identifier of the form"),
  submittedData: z.array(z.object({
    labelKey: z.string().describe("The label key of the field"),
    value: z.string().describe("The value of the field"),
  })).describe("The submitted data"),
})
export const submitFormOutputModel = z.object({
  success: z.boolean().describe("Whether the form submission was submitted successfully"),
})
