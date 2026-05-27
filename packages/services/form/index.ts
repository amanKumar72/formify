import db, { desc, eq } from "@repo/database";
import { createFormInput, CreateFormInputType, updateFormInput, updateFormInputType } from "./model";
import { formTable } from "@repo/database/schema";

class FormService {
    public async createForm(payload: CreateFormInputType, userId: string) {
        const { title, description } = await createFormInput.parseAsync(payload);
        const form = await db.insert(formTable).values({
                title: title,
                description: description,
                createdBy: userId,
        }).returning({
            id: formTable.id,
        }).execute()
        if(!form || form.length === 0 || !form[0]?.id) {
            throw new Error("Failed to create form");
        }
        return form[0];
    }
    public async updateForm(payload: updateFormInputType, userId: string) {
        const { id, title, description } = await updateFormInput.parseAsync(payload);
        const [existingForm] = await db.select().from(formTable).where(eq(formTable.id, id));
        if(!existingForm) {
            throw new Error("Form not found");
        }
        if(userId !== existingForm.createdBy) {
            throw new Error("You are not the creator of this form");
        }
        const updateData = {
                title: title || existingForm.title,
                description: description || existingForm.description,
                createdBy: existingForm.createdBy,
                createdAt: existingForm.createdAt,
                updatedAt: new Date(),
        };
        const form = await db.update(formTable).set(updateData).returning({
            id: formTable.id,
        }).execute()
        if(!form || form.length === 0 || !form[0]?.id) {
            throw new Error("Failed to update form");
        }
        return updateData;
    }
    public async getFormById(id: string) {
        const [form] = await db.select().from(formTable).where(eq(formTable.id, id));
        if(!form) {
            throw new Error("Form not found");
        }
        return form;
    }
    public async deleteForm(id: string, userId: string) {
        const [form] = await db.select().from(formTable).where(eq(formTable.id, id));
        if(!form) {
            throw new Error("Form not found");
        }
        if(userId !== form.createdBy) {
            throw new Error("You are not the creator of this form");
        }
        await db.delete(formTable).where(eq(formTable.id, id));
        return {success: true};
    }
    public async getMyForms(userId: string) {
        console.log(userId)
        const forms = await db.select().from(formTable).where(eq(formTable.createdBy, userId)).orderBy(desc(formTable.createdAt)).execute();
        return forms;
    }
}

export default FormService;
