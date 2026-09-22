import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const permission = pgTable('permission', {
  id: text('id').primaryKey(),

  name: text('name').notNull().unique(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
