import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { category } from './category.schema.js';

export const subcategory = pgTable('subcategory', {
  id: text('id').primaryKey(),

  categoryId: text('category_id')
    .notNull()
    .references(() => category.id, {
      onDelete: 'cascade',
    }),

  name: text('name').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
