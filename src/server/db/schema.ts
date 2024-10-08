import { relations, sql } from "drizzle-orm";
import {
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `car-tracker_${name}`);
export const taskStatuses = pgEnum("task_status", [
  "running",
  "success",
  "failure",
]);

// export const posts = createTable(
//   "post",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("created_by", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: timestamp("created_at", { withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//       () => new Date(),
//     ),
//   },
//   (example) => ({
//     createdByIdIdx: index("created_by_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   }),
// );

export const scrapeEngines = createTable("scaper_engine", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const websites = createTable(
  "website",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    url: varchar("url", { length: 2048 }).notNull().unique(),
    scrappingStartUrl: varchar("scrapping_start_url", { length: 2048 })
      .notNull()
      .unique(),
    address: text("address").notNull(),
    scrapeEngineId: integer("scrape_engine_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      scrapeEngineIdx: index("scrape_engine_idx").on(table.scrapeEngineId),
      scrapeEngineReference: foreignKey({
        columns: [table.scrapeEngineId],
        foreignColumns: [scrapeEngines.id],
        name: "website_scrape_engine_fk",
      }),
    };
  },
);

export const tasks = createTable(
  "task",
  {
    id: serial("id").primaryKey(),
    status: taskStatuses("task_status").notNull(),
    websiteId: integer("website_id")
      .notNull()
      .references(() => websites.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
  },
  (table) => {
    return {
      taskWebsiteIdx: index("task_website_idx").on(table.websiteId),
    };
  },
);

export const logs = createTable(
  "log",
  {
    id: serial("id").primaryKey(),
    taskId: integer("task_id")
      .notNull()
      .references(() => tasks.id),
    content: text("content"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      taskIds: index("task_idx").on(table.taskId),
    };
  },
);

export const cars = createTable(
  "car",
  {
    id: serial("id").primaryKey(),
    year: integer("year"),
    model: varchar("model", { length: 255 }),
    odometer: integer("odometer"),
    price: integer("price"),
    linkToAd: varchar("link_to_ad", { length: 2048 }).notNull(),
    description: text("description"),
    websiteId: integer("website_id")
      .notNull()
      .references(() => websites.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (table) => {
    return {
      carWebsiteIdx: index("car_website_idx").on(table.websiteId),
    };
  },
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
