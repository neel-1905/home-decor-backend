import {
  pgTable,
  text,
  integer,
  timestamp,
  check,
  unique,
} from 'drizzle-orm/pg-core';

import { sql } from 'drizzle-orm';

import { user } from './user.schema.js';
import { product } from './product.schema.js';

export const review = pgTable(
  'review',
  {
    id: text('id').primaryKey(),

    productId: text('product_id')
      .notNull()
      .references(() => product.id, {
        onDelete: 'cascade',
      }),

    userId: text('user_id')
      .notNull()
      .references(() => user.id, {
        onDelete: 'cascade',
      }),

    rating: integer('rating').notNull(),

    message: text('message').notNull(),

    images: text('images').array(),

    createdAt: timestamp('created_at').defaultNow().notNull(),

    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => ({
    uniqueUserProduct: unique('unique_user_product_review').on(
      table.userId,
      table.productId,
    ),

    ratingCheck: check(
      'rating_check',
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`,
    ),
  }),
);
