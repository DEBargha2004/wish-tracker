import { base } from "@/lib/orpc/orpc";
import { ORPCError } from "@orpc/client";
import { sql } from "drizzle-orm";
import z from "zod";

export type TData = { date: string };

const userEventsByMonthInput = z.object({
  query: z.string().optional(),
});

const authMiddleware = base.middleware(async ({ context, next }) => {
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

export const userEventsByMonths = base
  .input(userEventsByMonthInput)
  .use(authMiddleware)
  .handler(async ({ context }) => {
    const events_by_months = await context.db.execute(
      sql`
            SELECT d::date AS date FROM GENERATE_SERIES(
                DATE '2026-01-01',
                DATE '2026-12-01',
                INTERVAL '1 MONTH'
            ) AS d
        `
    );

    return events_by_months.rows as TData[];
  });
