import * as z from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  NEXT_PUBLIC_S3_BUCKET_NAME: z.string(),
});

export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
