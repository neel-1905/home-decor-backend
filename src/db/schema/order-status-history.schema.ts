import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { order, orderStatusEnum } from './order.schema.js';

export const orderStatusHistory = pgTable('order_status_history', {
  id: uuid('id').defaultRandom().primaryKey(),

  orderId: uuid('order_id')
    .notNull()
    .references(() => order.id, {
      onDelete: 'cascade',
    }),

  status: orderStatusEnum('status').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
});
