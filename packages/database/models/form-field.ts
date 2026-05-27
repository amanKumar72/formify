import { pgEnum, json, pgTable, uuid, varchar, timestamp, boolean, text, integer } from "drizzle-orm/pg-core";
import { formTable } from "./form";

export const fieldTypeEnum = pgEnum("field_type_enum",{
  Text: "text",
  Number: "number",
  Email: "email",
  Password: "password",
  Checkbox: "checkbox",
  Radio: "radio",
  Select: "select",
  File: "file",
})

export const formFieldTable = pgTable("form_fields", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").references(()=>formTable.id).notNull(),
  label: varchar("label", { length: 80 }).notNull(),
  labelKey: varchar("label_key", { length: 80 }).notNull(),
  type: fieldTypeEnum("type").notNull(),
  options: json("options").array().default([]),
  required: boolean("required").default(false),
  placeholder: varchar("placeholder", { length: 80 }),  
  description: varchar("description", { length: 255 }),
  order: integer("order").default(0).notNull(),
});
