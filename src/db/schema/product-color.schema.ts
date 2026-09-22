import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { product } from './product.schema.js';
import { color } from './color.schema.js';

export const productColor = pgTable(
  'product_color',
  {
    productId: text('product_id')
      .notNull()
      .references(() => product.id, {
        onDelete: 'cascade',
      }),

    colorId: text('color_id')
      .notNull()
      .references(() => color.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.productId, table.colorId],
    }),
  }),
);
