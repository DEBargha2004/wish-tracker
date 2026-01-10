import { base } from "@/lib/orpc/orpc";
import { ORPCError } from "@orpc/client";

export const authMiddleware = base.middleware(async ({ context, next }) => {
  const session = await context.auth.api.getSession({
    headers: context.headers,
  });

  if (!session?.user)
    throw new ORPCError("UNAUTHORIZED", { message: "User Not Logged In" });

  return next({
    context: {
      session,
    },
  });
});
