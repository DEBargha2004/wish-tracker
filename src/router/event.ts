import { events, TEventUserInfo } from "@/db/schema";
import { db } from "@/lib/db";
import { base } from "@/lib/orpc/orpc";
import { ORPCError } from "@orpc/client";
import { desc, sql } from "drizzle-orm";
import z from "zod";
import { user } from "../../auth-schema";
import { eventSchema } from "@/schema/event";

type TUser = {
  id: string;
  other_info: TEventUserInfo;
  month: number;
  day: number;
  name: string;
};
export type TEventDataByMonth = { date: string; total: number; users: TUser[] };

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
                MAKE_DATE(${year}, 1, 1),
                MAKE_DATE(${year}, 12, 1),
                INTERVAL '1 MONTH'
              ) AS d
            ),
            ranked_events AS (
              select ts.date as ts_date, events.*,
              ROW_NUMBER() OVER (
                PARTITION BY ts.date
                ORDER BY ${desc(events.createdAt)}
              ) AS rn
              FROM time_series ts
              LEFT JOIN ${events} 
              ON MAKE_DATE(${year},${events.month},${events.day}) >= ts.date
              AND MAKE_DATE(${year},${events.month},${
        events.day
      }) < ts.date + INTERVAL '1 month'
              AND ${events.creatorId} = ${context.session.user.id}
            )

            SELECT ts_date as date, count(id)::INT AS total,
            COALESCE(
              JSON_AGG(
                JSON_BUILD_OBJECT(
                  'id', id,
                  'other_info', "other_info",
                  'month', month,
                  'day' , day,
                  'name', name
                )
                ORDER BY created_at DESC
              ) FILTER (WHERE id IS NOT NULL AND rn <= 3),
              '[]'::JSON
            ) AS users
            FROM ranked_events
            GROUP BY ts_date
            ORDER BY ts_date;
        `
    );

    return events_by_months.rows as TEventDataByMonth[];
  });

export const createUserEvent = base
  .use(authMiddleware)
  .input(eventSchema)
  .handler(async ({ context, input }) => {
    const res = await db
      .insert(events)
      .values({
        creatorId: context.session.user.id,
        name: input.name,
        description: input.description,
        day: Number(input.day),
        month: Number(input.month),
        otherInfo: {
          avatar: input.avatar,
          phone: input.phone,
          whatsapp: input.whatsapp,
        },
      })
      .returning();

    return res[0];
  });
