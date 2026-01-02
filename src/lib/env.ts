import * as z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
});

export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
