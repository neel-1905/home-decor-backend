import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const category = pgTable('category', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  icon: text('icon').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
