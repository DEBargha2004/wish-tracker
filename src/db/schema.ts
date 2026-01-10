import { relations, sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  jsonb,
  smallint,
} from "drizzle-orm/pg-core";
import { index } from "drizzle-orm/pg-core";
import { timestamp } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export type TEventUserInfo = {
  avatar?: string;
  phone?: string;
  whatsapp?: string;
};

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
};

export const featureFlags = pgTable("feature-flags", {
  id: text("id").primaryKey(),
  value: boolean("value"),
});

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  ...timestamps,
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ...timestamps,
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    ...timestamps,
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    ...timestamps,
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const events = pgTable(
  "events",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    otherInfo: jsonb("other_info").$type<TEventUserInfo>(),
    month: smallint("month").notNull(),
    day: smallint("day").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    creatorId: text("creator_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    ...timestamps,
    deletedAt: date("deleted_at"),
  },
  (table) => [
    check(
      "valid_date_check",
      sql`
      (
        (month in (1,3,5,7,8,10,12) AND day BETWEEN 1 AND 31) OR
        (month in (2,4,6,9,11) AND day BETWEEN 1 AND 30) OR
        (month = 2 AND day BETWEEN 1 AND 29)
      )
    `
    ),
  ]
);

export type TDBEvent = typeof events.$inferSelect;
