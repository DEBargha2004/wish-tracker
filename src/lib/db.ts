import { drizzle } from "drizzle-orm/neon-serverless";
import { env } from "process";

export const db = drizzle(env.DATABASE_URL);
