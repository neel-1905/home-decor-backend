import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@lib/auth';
import { UsersModule } from '@modules/users/users.module';
import { RbacModule } from './modules/rbac/rbac.module';

@Module({
  imports: [AuthModule.forRoot({ auth }), UsersModule, RbacModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
