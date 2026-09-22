import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './user.schema.js';

export const cart = pgTable('cart', {
  id: text('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .unique()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
