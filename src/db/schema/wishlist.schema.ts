import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './user.schema.js';

export const wishlist = pgTable('wishlist', {
  id: text('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),

  name: text('name').notNull(),

  description: text('description'),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
