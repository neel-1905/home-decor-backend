import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const role = pgTable('role', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull().unique(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
