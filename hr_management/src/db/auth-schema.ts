import { pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable(
  "users",
  {
    id: uuid("id").notNull().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    hashedPassword: text("hashed_password").notNull(),
    salt: text("salt").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (users) => [
    uniqueIndex("email_idx").on(users.email),
  ]
);


export const insertHrUserSchema = createInsertSchema(users)
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters long").optional()
  });
export const selectHrUserSchema = createSelectSchema(users);
export const updateHrUserSchema = createUpdateSchema(users);

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: timestamp("expires_at"),
    tokenType: text("token_type"),
    scope: text("scope"),
    idToken: text("id_token"),
    sessionState: text("session_state"),
  },
  (account) => [
  uniqueIndex("account_provider_accountId_idx").on(account.provider, account.providerAccountId),
]
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: uuid("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires").notNull(),
  }
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires").notNull(),
  },
  (vt) => [
  uniqueIndex("verification_token_identifier_token_idx").on(vt.identifier, vt.token),
]
);
