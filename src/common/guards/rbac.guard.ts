import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { PERMISSIONS_KEY } from '../decorators/permission.decorator.js';
import { RbacService } from '@/modules/rbac/rbac.service.js';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // No RBAC permission required for this route
    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const session = request.session;

    if (!session?.user) {
      throw new ForbiddenException('Authentication required');
    }

    const hasPermission = await this.rbacService.hasPermissions(
      session.user.id,
      requiredPermissions,
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        'You do not have permission to perform this action',
      );
    }

    return true;
  }
}
