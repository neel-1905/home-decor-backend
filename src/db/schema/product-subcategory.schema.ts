import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { product } from './product.schema.js';
import { subcategory } from './subcategory.schema.js';

export const productSubcategory = pgTable(
  'product_subcategory',
  {
    productId: text('product_id')
      .notNull()
      .references(() => product.id, {
        onDelete: 'cascade',
      }),

    subcategoryId: text('subcategory_id')
      .notNull()
      .references(() => subcategory.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.productId, table.subcategoryId],
    }),
  }),
);
