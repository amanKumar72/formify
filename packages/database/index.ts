import "dotenv/config";
import { env } from "./env";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

const sql = neon(env.DATABASE_URL!);

export const db = drizzle(sql);
export * from "drizzle-orm";
export default db;
