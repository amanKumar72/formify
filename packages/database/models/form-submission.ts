import { pgEnum, numeric, pgTable, uuid, varchar, timestamp, boolean, text, integer, json, makePgArray } from "drizzle-orm/pg-core";
import { formTable } from "./form";
import { usersTable } from "./user";

export const formSubmissionTable = pgTable("form_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  formId: uuid("form_id").references(()=>formTable.id).notNull(),
  userId: uuid("user_id").references(()=>usersTable.id),
  ip: varchar("ip", { length: 45 }).notNull(),
  userAgent: varchar("user_agent", { length: 255 }),
  submittedData: json("submitted_data"),
  createdAt: timestamp("created_at").defaultNow(),
});