import { pgTable, primaryKey, text, uuid } from 'drizzle-orm/pg-core';

import { wishlist } from './wishlist.schema.js';
import { product } from './product.schema.js';

export const wishlistProduct = pgTable(
  'wishlist_product',
  {
    wishlistId: uuid('wishlist_id')
      .notNull()
      .references(() => wishlist.id, {
        onDelete: 'cascade',
      }),

    productId: uuid('product_id')
      .notNull()
      .references(() => product.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.wishlistId, table.productId],
    }),
  }),
);
