import {
  pgTable,
  text,
  timestamp,
  numeric,
  boolean,
  uuid,
} from 'drizzle-orm/pg-core';

export const product = pgTable('product', {
  id: uuid('id').defaultRandom().primaryKey(),

  name: text('name').notNull(),

  description: text('description').notNull(),

  price: numeric('price', {
    precision: 10,
    scale: 2,
  }).notNull(),

  images: text('images').array().notNull(),

  isActive: boolean('is_active').default(true).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
