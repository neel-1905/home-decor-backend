import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const color = pgTable('color', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull().unique(),

  value: text('value').notNull(),
});
