import db, { desc, eq } from "@repo/database";
import { formSubmissionTable, formTable } from "@repo/database/schema";
import { createFormSubmissionInput, CreateFormSubmissionInputType } from "./model";
import { fieldTypeEnum, formFieldTable } from "@repo/database/models/form-field";

class FormSubmissionService {   
    private async getFormById(formId: string) {
        const [form] = await db.select().from(formTable).where(eq(formTable.id, formId)).execute();
        if(!form) {
            throw new Error("Form not found");
        }
        return form;
    }
    private isFormCreatedByUser(form: any, userId: string) {
        if(form.createdBy !== userId) {
            throw new Error("Form not created by the user");
        }
    }
    private async getFormSubmissions(formId: string) {
        const formSubmissions = await db.select().from(formSubmissionTable).where(eq(formSubmissionTable.formId, formId)).orderBy(desc(formSubmissionTable.createdAt)).execute();
        if(!formSubmissions || formSubmissions.length === 0) {
            throw new Error("Form submissions not found");
        }
        return formSubmissions;
    }
    private async isFormSubmittedByIp(ip: string) {
        const [formSubmission] = await db.select().from(formSubmissionTable).where(eq(formSubmissionTable.ip, ip)).execute();
        if(formSubmission) {
            throw new Error("This form is already submitted by you");
        }
    }
    public async submitFormByUser(input: CreateFormSubmissionInputType) {
        try {
            const { formId, userId, ip, userAgent, submittedData } = await createFormSubmissionInput.parseAsync(input);
            if(ip) {
                await this.isFormSubmittedByIp(ip);
            }
            await db.insert(formSubmissionTable).values({
                formId,
                userId,
                ip,
                userAgent,
                submittedData: JSON.stringify(submittedData),
            }).returning().execute();
            return { success: true };
        } catch (error) {
            console.log({error});
            throw error;
        }
    }
    public async getAllFormSubmissionsByFormId(formId: string, userId: string) {
        const form = await this.getFormById(formId);
        this.isFormCreatedByUser(form, userId);
        const formSubmissions = await this.getFormSubmissions(formId);
        return formSubmissions;
    }
    public async getAllFormSubmissions(userId: string) {
        const formSubmissions = await db.select().from(formSubmissionTable).where(eq(formSubmissionTable.userId, userId)).orderBy(desc(formSubmissionTable.createdAt)).execute();
        return formSubmissions;
    }
}

export default FormSubmissionService;
