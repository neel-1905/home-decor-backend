import {
  pgTable,
  text,
  timestamp,
  numeric,
  pgEnum,
  uuid,
} from 'drizzle-orm/pg-core';

import { user } from './user.schema.js';

export const paymentMethodEnum = pgEnum('payment_method', [
  'paypal',
  'credit_card',
  'apple_pay',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'placed',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
]);

export const order = pgTable('order', {
  id: uuid('id').defaultRandom().primaryKey(),

  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),

  subtotal: numeric('subtotal', {
    precision: 10,
    scale: 2,
  }).notNull(),

  tax: numeric('tax', {
    precision: 10,
    scale: 2,
  }).notNull(),

  deliveryFee: numeric('delivery_fee', {
    precision: 10,
    scale: 2,
  }).notNull(),

  total: numeric('total', {
    precision: 10,
    scale: 2,
  }).notNull(),

  paymentMethod: paymentMethodEnum('payment_method').notNull(),

  status: orderStatusEnum('status').notNull().default('placed'),

  shippingName: text('shipping_name').notNull(),

  shippingAddress: text('shipping_address').notNull(),

  estimatedDelivery: timestamp('estimated_delivery'),

  createdAt: timestamp('created_at').defaultNow().notNull(),

  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
