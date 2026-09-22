import { db } from '@/db';
import { permission, role, rolePermission, user } from '@/db/schema';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class RbacService {
  async hasPermissions(
    userId: string,
    requiredPermissions: string[],
  ): Promise<boolean> {
    if (requiredPermissions.length === 0) {
      return true;
    }

    const result = await db
      .select({
        permission: permission.name,
      })
      .from(user)
      .innerJoin(role, eq(user.roleId, role.id))
      .innerJoin(rolePermission, eq(role.id, rolePermission.roleId))
      .innerJoin(permission, eq(rolePermission.permissionId, permission.id))
      .where(eq(user.id, userId));

    const userPermissions = new Set(result.map((item) => item.permission));

    return requiredPermissions.every((requiredPermission) =>
      userPermissions.has(requiredPermission),
    );
  }
}
