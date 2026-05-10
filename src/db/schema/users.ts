import { sql } from 'drizzle-orm';
import { bigint, boolean, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar({ length: 20 }).primaryKey(),
  banned: boolean(),
  bannedReason: varchar({ length: 255 }),
  count: bigint({ mode: 'bigint' }).default(sql`0`),
  language: varchar({ length: 10 }).notNull().default('ko'),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => sql`NOW()`)
});

export const activities = pgTable('activities', {
  id: varchar({ length: 20 })
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  flagquiz: bigint({ mode: 'bigint' }).default(sql`0`),
  rps: bigint({ mode: 'bigint' }).default(sql`0`),
  money: bigint({ mode: 'bigint' }).default(sql`0`),
  lastClaim: timestamp().defaultNow(),
  winMoney: bigint({ mode: 'bigint' }).default(sql`0`),
  loseMoney: bigint({ mode: 'bigint' }).default(sql`0`)
});

export const statistics = pgTable('statistics', {
  command: varchar({ length: 255 }).primaryKey(),
  count: bigint({ mode: 'bigint' }).default(sql`0`)
});
