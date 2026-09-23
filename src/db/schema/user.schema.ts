import { relations } from 'drizzle-orm';
import {
  pgTable,
  text,
  timestamp,
  boolean,
  date,
  uuid,
} from 'drizzle-orm/pg-core';
import { session } from './session.schema';
import { account } from './account.schema';
import { role } from './role.schema';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  mobile: text('mobile').notNull(),
  dob: date('dob', { mode: 'string' }).notNull(),
  image: text('image'),

  roleId: uuid('role_id').references(() => role.id),

  isOnboardingComplete: boolean('is_onboarding_complete')
    .default(false)
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));
