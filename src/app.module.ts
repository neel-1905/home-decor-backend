import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@lib/auth';
import { RbacModule } from '@modules/rbac/rbac.module';

@Module({
  imports: [AuthModule.forRoot({ auth }), RbacModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
