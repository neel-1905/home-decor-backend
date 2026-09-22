import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core';

import { user } from './user.schema.js';

export const userAddress = pgTable('user_address', {
  id: text('id').primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),

  name: text('name').notNull(),

  address: text('address').notNull(),

  isDefault: boolean('is_default').default(false).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
