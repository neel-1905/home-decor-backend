import { and, eq } from 'drizzle-orm';

import { db } from '..';
import { role } from '../schema/role.schema';
import { permission } from '../schema/permission.schema';
import { rolePermission } from '../schema/role-permission.schema';

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
  console.log('Seeding RBAC...');

  // -------------------------
  // Roles
  // -------------------------

  const existingRoles = await db.select().from(role);

  let userRole = existingRoles.find((item) => item.name === 'User');
  let adminRole = existingRoles.find((item) => item.name === 'Admin');

  if (!userRole) {
    const [createdRole] = await db
      .insert(role)
      .values({
        name: 'User',
      })
      .returning();

    userRole = createdRole;
  }

  if (!adminRole) {
    const [createdRole] = await db
      .insert(role)
      .values({
        name: 'Admin',
      })
      .returning();

    adminRole = createdRole;
  }

  console.log('Roles seeded');

  // -------------------------
  // Permissions
  // -------------------------

  const permissionRecords = [];

  for (const permissionName of permissions) {
    const existingPermission = await db
      .select()
      .from(permission)
      .where(eq(permission.name, permissionName))
      .limit(1);

    if (existingPermission.length > 0) {
      permissionRecords.push(existingPermission[0]);
      continue;
    }

    const [createdPermission] = await db
      .insert(permission)
      .values({
        name: permissionName,
      })
      .returning();

    permissionRecords.push(createdPermission);
  }

  console.log('Permissions seeded');

  // -------------------------
  // Admin permissions
  // -------------------------

  for (const permissionRecord of permissionRecords) {
    const existingRolePermission = await db
      .select()
      .from(rolePermission)
      .where(
        and(
          eq(rolePermission.roleId, adminRole.id),
          eq(rolePermission.permissionId, permissionRecord.id),
        ),
      )
      .limit(1);

    if (existingRolePermission.length === 0) {
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
