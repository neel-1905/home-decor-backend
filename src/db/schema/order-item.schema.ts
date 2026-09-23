import {
  pgTable,
  primaryKey,
  integer,
  text,
  numeric,
  uuid,
} from 'drizzle-orm/pg-core';

import { order } from './order.schema.js';
import { product } from './product.schema.js';

export const orderItem = pgTable(
  'order_item',
  {
    orderId: uuid('order_id')
      .notNull()
      .references(() => order.id, {
        onDelete: 'cascade',
      }),

    productId: uuid('product_id')
      .notNull()
      .references(() => product.id, {
        onDelete: 'restrict',
      }),

    quantity: integer('quantity').notNull(),

    price: numeric('price', {
      precision: 10,
      scale: 2,
    }).notNull(),

    subtotal: numeric('subtotal', {
      precision: 10,
      scale: 2,
    }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.orderId, table.productId],
    }),
  }),
);
