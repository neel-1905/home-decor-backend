import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { category } from './category.schema.js';

export const subcategory = pgTable('subcategory', {
  id: uuid('id').defaultRandom().primaryKey(),

  categoryId: uuid('category_id')
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
