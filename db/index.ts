// db/index.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" }); // or .env.local

const sql = neon(process.env.DATABASE_URL || "postgres://mock:mock@mock:5432/mock");
export const db = drizzle({ client: sql });