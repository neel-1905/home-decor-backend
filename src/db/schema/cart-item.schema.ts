import { pgTable, primaryKey, integer, text, uuid } from 'drizzle-orm/pg-core';

import { cart } from './cart.schema.js';
import { product } from './product.schema.js';

export const cartItem = pgTable(
  'cart_item',
  {
    cartId: uuid('cart_id')
      .notNull()
      .references(() => cart.id, {
        onDelete: 'cascade',
      }),

    productId: uuid('product_id')
      .notNull()
      .references(() => product.id, {
        onDelete: 'cascade',
      }),

    quantity: integer('quantity').notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.cartId, table.productId],
    }),
  }),
);
