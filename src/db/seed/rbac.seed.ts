import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { and, eq } from 'drizzle-orm';

import { role } from '../schema/role.schema';
import { permission } from '../schema/permission.schema.js';
import { rolePermission } from '../schema/role-permission.schema.js';
import { ENV } from '@/config/env.config';
import { db } from '..';

const permissions = [
  'category:create',
  'category:update',
  'category:delete',

  'subcategory:create',
  'subcategory:update',
  'subcategory:delete',

  'product:create',
  'product:update',
  'product:delete',
];

async function seed() {
  console.log('Seeding roles and permissions...');

  // -------------------------
  // Roles
  // -------------------------

  const existingRoles = await db.select().from(role);

  let userRole = existingRoles.find((item) => item.name === 'User');
  let adminRole = existingRoles.find((item) => item.name === 'Admin');

  if (!userRole) {
    const [created] = await db
      .insert(role)
      .values({
        name: 'User',
      })
      .returning();

    userRole = created;
  }

  if (!adminRole) {
    const [created] = await db
      .insert(role)
      .values({
        name: 'Admin',
      })
      .returning();

    adminRole = created;
  }

  console.log('Roles seeded');

  // -------------------------
  // Permissions
  // -------------------------

  const permissionRecords = [];

  for (const permissionName of permissions) {
    const existing = await db
      .select()
      .from(permission)
      .where(eq(permission.name, permissionName))
      .limit(1);

    if (existing.length > 0) {
      permissionRecords.push(existing[0]);
      continue;
    }

    const [created] = await db
      .insert(permission)
      .values({
        name: permissionName,
      })
      .returning();

    permissionRecords.push(created);
  }

  console.log('Permissions seeded');

  // -------------------------
  // Admin permissions
  // -------------------------

  for (const permissionRecord of permissionRecords) {
    const existing = await db
      .select()
      .from(rolePermission)
      .where(
        and(
          eq(rolePermission.roleId, adminRole.id),
          eq(rolePermission.permissionId, permissionRecord.id),
        ),
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(rolePermission).values({
        roleId: adminRole.id,
        permissionId: permissionRecord.id,
      });
    }
  }

  console.log('Admin permissions assigned');

  console.log('RBAC seed completed successfully');
}

seed().catch((error) => {
  console.error('RBAC seed failed:', error);
  process.exit(1);
});
