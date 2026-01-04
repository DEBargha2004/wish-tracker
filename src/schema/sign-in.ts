import { z } from "zod";

export const signInSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean(),
});

export type TSignInSchema = z.infer<typeof signInSchema>;

export const getSignInDefaultValues = (): TSignInSchema => ({
  email: "",
  password: "",
  rememberMe: false,
});
