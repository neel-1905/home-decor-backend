import { Controller, Get, UseGuards } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RequirePermissions } from '@/common/decorators';
import { RbacGuard } from '@/common/guards';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  @Get('test')
  @UseGuards(RbacGuard)
  @RequirePermissions('product:create')
  testRbac() {
    return {
      success: true,
      message: 'RBAC permission granted',
    };
  }
}
