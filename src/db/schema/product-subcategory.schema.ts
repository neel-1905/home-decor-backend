import { pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';

import { product } from './product.schema.js';
import { subcategory } from './subcategory.schema.js';

export const productSubcategory = pgTable(
  'product_subcategory',
  {
    productId: uuid('product_id')
      .notNull()
      .references(() => product.id, {
        onDelete: 'cascade',
      }),

    subcategoryId: uuid('subcategory_id')
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
