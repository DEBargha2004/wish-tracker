import { events } from "@/db/schema";
import { db } from "@/lib/db";
import { base } from "@/lib/orpc/orpc";
import { ORPCError } from "@orpc/client";
import { desc, sql } from "drizzle-orm";
import z from "zod";
import { user } from "../../auth-schema";

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
    const year = new Date().getUTCFullYear();
    const events_by_months = await context.db.execute(
      sql`
            WITH time_series AS (
              SELECT d::date AS date FROM GENERATE_SERIES(
                make_date(${year}, 1, 1),
                make_date(${year}, 12, 1),
                INTERVAL '1 MONTH'
              ) AS d
            )

            select ts.date as date, count(${events.id})::int as total,
            COALESCE(
              JSON_AGG(
              json_build_object(
                'id', ${events.id},
                'user', ${events.user},
                'month', ${events.month}
                )
              ) filter (where ${events.id} is not null),
              '[]'::JSON
            ) as users
            from time_series ts
            left join ${events}
            on make_date(${year},${events.month},${events.day}) >= ts.date
            and make_date(${year},${events.month},${
        events.day
      }) < ts.date + INTERVAL '1 month'
            and ${events.creatorId} = ${context.session.user.id}
            group by ${events.month}, ts.date, ${events.createdAt}
            order by ${desc(events.createdAt)};
        `
    );

    console.log(JSON.stringify(events_by_months.rows, null, 2));

    return events_by_months.rows as TData[];
  });
