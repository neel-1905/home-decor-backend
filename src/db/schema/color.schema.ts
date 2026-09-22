import { pgTable, text } from 'drizzle-orm/pg-core';

export const color = pgTable('color', {
  id: text('id').primaryKey(),

  name: text('name').notNull().unique(),

  value: text('value').notNull(),
});
