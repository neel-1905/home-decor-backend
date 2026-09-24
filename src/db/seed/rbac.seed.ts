import { and, eq } from 'drizzle-orm';

import { db } from '../index';
import { role } from '../schema/role.schema';
import { permission } from '../schema/permission.schema';
import { rolePermission } from '../schema/role-permission.schema';

const permissions = [
  // Users
  'user:read',
  'user:update',
  'user:delete',

  // Categories
  'category:create',
  'category:read',
  'category:update',
  'category:delete',

  // Subcategories
  'subcategory:create',
  'subcategory:read',
  'subcategory:update',
  'subcategory:delete',

  // Products
  'product:create',
  'product:read',
  'product:update',
  'product:delete',

  // Colors
  'color:create',
  'color:read',
  'color:update',
  'color:delete',

  // Reviews
  'review:create',
  'review:read',
  'review:update',
  'review:delete',

  // Wishlist
  'wishlist:create',
  'wishlist:read',
  'wishlist:delete',
  'wishlist:update',

  // Cart
  'cart:create',
  'cart:read',
  'cart:update',
  'cart:delete',

  // Orders
  'order:create',
  'order:read',
  'order:update',
  'order:delete',

  // Payments
  'payment:create',
  'payment:read',
  'payment:update',
];

const adminPermissions = permissions;

const userPermissions = [
  // Products/catalog
  'category:read',
  'subcategory:read',
  'product:read',
  'color:read',

  // Reviews
  'review:create',
  'review:read',
  'review:update',
  'review:delete',

  // Wishlist
  'wishlist:create',
  'wishlist:read',
  'wishlist:delete',

  // Cart
  'cart:create',
  'cart:read',
  'cart:update',
  'cart:delete',

  // Orders
  'order:create',
  'order:read',

  // Payments
  'payment:create',
  'payment:read',
];

async function seed() {
  console.log('🌱 Seeding RBAC...');

  // --------------------------------------------------
  // 1. Create / get roles
  // --------------------------------------------------

  let userRole = (
    await db.select().from(role).where(eq(role.name, 'User')).limit(1)
  )[0];

  if (!userRole) {
    [userRole] = await db
      .insert(role)
      .values({
        name: 'User',
      })
      .returning();
  }

  let adminRole = (
    await db.select().from(role).where(eq(role.name, 'Admin')).limit(1)
  )[0];

  if (!adminRole) {
    [adminRole] = await db
      .insert(role)
      .values({
        name: 'Admin',
      })
      .returning();
  }

  console.log('✅ Roles ready');

  // --------------------------------------------------
  // 2. Create / get permissions
  // --------------------------------------------------

  const permissionRecords = [];

  for (const permissionName of permissions) {
    let permissionRecord = (
      await db
        .select()
        .from(permission)
        .where(eq(permission.name, permissionName))
        .limit(1)
    )[0];

    if (!permissionRecord) {
      [permissionRecord] = await db
        .insert(permission)
        .values({
          name: permissionName,
        })
        .returning();
    }

    permissionRecords.push(permissionRecord);
  }

  console.log('✅ Permissions ready');

  // --------------------------------------------------
  // 3. Assign Admin permissions
  // --------------------------------------------------

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

  console.log('✅ Admin permissions assigned');

  // --------------------------------------------------
  // 4. Assign User permissions
  // --------------------------------------------------

  for (const permissionName of userPermissions) {
    const permissionRecord = permissionRecords.find(
      (item) => item.name === permissionName,
    );

    if (!permissionRecord) {
      continue;
    }

    const existing = await db
      .select()
      .from(rolePermission)
      .where(
        and(
          eq(rolePermission.roleId, userRole.id),
          eq(rolePermission.permissionId, permissionRecord.id),
        ),
      )
      .limit(1);

    if (existing.length === 0) {
      await db.insert(rolePermission).values({
        roleId: userRole.id,
        permissionId: permissionRecord.id,
      });
    }
  }

  console.log('✅ User permissions assigned');

  console.log('🌱 RBAC seed completed successfully');
}

seed().catch((error) => {
  console.error('❌ RBAC seed failed:', error);
  process.exit(1);
});
