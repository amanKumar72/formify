import db, { desc, eq } from "@repo/database";
import { formFieldTable, formTable } from "@repo/database/schema";
import { createFormFieldInput, CreateFormFieldInputType, updateFormFieldInput, UpdateFormFieldInputType } from "./model";
import { fieldTypeEnum } from "@repo/database/models/form-field";

class FormFieldService {
    private async getFormById(formId: string) {
        const [form] = await db.select().from(formTable).where(eq(formTable.id, formId)).execute();
        if(!form) {
            throw new Error("Form not found");
        }
        return form;
    }
    private async getFormFieldById(fieldId: string) {
        const [formField] = await db.select().from(formFieldTable).where(eq(formFieldTable.id, fieldId)).execute();
        if(!formField) {
            throw new Error("Form field not found");
        }
        return formField;
    }
    private isFormCreatedByUser(form: any, userId: string) {
        if(form.createdBy !== userId) {
            throw new Error("Form not created by the user");
        }
    }
    private isFormFieldBelongToForm(formField: any, formId: string) {
        if(formField.formId !== formId) {
            throw new Error("Form field not belong to the form");
        };
    }
    public async createFormField(formId: string, userId: string, field: CreateFormFieldInputType) {
        const {label, type, placeholder, description, order, required} = await createFormFieldInput.parseAsync(field);
        const form = await this.getFormById(formId);
        this.isFormCreatedByUser(form, userId);
        
        const [formField] = await db.insert(formFieldTable).values({
            formId,
            label,
            labelKey: label.toLowerCase().replace(/\s+/g, "-"),
            type,
            placeholder,
            description,
            order: String(order),
            required,
        } as any).returning({
            id: formFieldTable.id,
            formId: formFieldTable.formId,
            label: formFieldTable.label,
            labelKey: formFieldTable.labelKey,
            type: formFieldTable.type,
            placeholder: formFieldTable.placeholder,
            description: formFieldTable.description,
            order: formFieldTable.order,
            required: formFieldTable.required,
        }).execute();
        if(!formField) {
            throw new Error("Form field not created");
        }
        return formField;
    }
    public async updateFormField(formId: string, userId: string, field: UpdateFormFieldInputType) {
        const {id, label, type, placeholder, description, order, required} = await updateFormFieldInput.parseAsync(field);
        const form = await this.getFormById(formId);
        const formField = await this.getFormFieldById(id);
        this.isFormCreatedByUser(form, userId);
        this.isFormFieldBelongToForm(formField, formId);
        
        await db.update(formFieldTable).set({
            label,
            labelKey: label.toLowerCase().replace(/\s+/g, "-"),
            type,
            placeholder,
            description,
            order,
            required,
        }).where(eq(formFieldTable.id, id)).execute();
        return field;
    }
    public async deleteFormField(formId: string, userId: string, fieldId: string) {
        const form = await this.getFormById(formId);
        this.isFormCreatedByUser(form, userId);
        const formField = await this.getFormFieldById(fieldId);
        this.isFormFieldBelongToForm(formField, formId);
        await db.delete(formFieldTable).where(eq(formFieldTable.id, fieldId)).execute();
        return {success: true};
    }
    public async getFormField(formId: string, fieldId: string) {
        const form = await this.getFormById(formId);
        const formField = await this.getFormFieldById(fieldId);
        this.isFormFieldBelongToForm(formField, formId);
        if(!formField) {
            throw new Error("Form field not found");
        }
        if(formField.formId !== formId) {
            throw new Error("Form field not belong to the form");
        }
        return formField;
    }
    public async getFormFields(formId: string) {
        const form = await this.getFormById(formId);
        const formFields = await db.select().from(formFieldTable).where(eq(formFieldTable.formId, formId)).orderBy(desc(formFieldTable.order)).execute();
        return formFields;
    }
    public async getFormFieldTypeOptions() {
        return fieldTypeEnum.enumValues;
    }
}

export default FormFieldService;
