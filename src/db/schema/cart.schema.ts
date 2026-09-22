import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { user } from './user.schema.js';

export const cart = pgTable('cart', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: uuid('user_id')
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
