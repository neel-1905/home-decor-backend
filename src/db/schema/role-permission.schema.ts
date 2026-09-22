import { pgTable, primaryKey, text } from 'drizzle-orm/pg-core';

import { role } from './role.schema.js';
import { permission } from './permission.schema.js';

export const rolePermission = pgTable(
  'role_permission',
  {
    roleId: text('role_id')
      .notNull()
      .references(() => role.id, {
        onDelete: 'cascade',
      }),

    permissionId: text('permission_id')
      .notNull()
      .references(() => permission.id, {
        onDelete: 'cascade',
      }),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.roleId, table.permissionId],
    }),
  }),
);
