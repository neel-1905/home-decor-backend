import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { APP_GUARD } from '@nestjs/core';
import { RbacGuard } from '@/common/guards';

@Module({
  controllers: [RbacController],
  providers: [
    RbacService,
    {
      provide: APP_GUARD,
      useClass: RbacGuard,
    },
  ],
})
export class RbacModule {}
