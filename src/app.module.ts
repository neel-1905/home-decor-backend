import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@lib/auth';
import { UsersModule } from '@modules/users/users.module';
import { RbacModule } from '@modules/rbac/rbac.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { SubcategoryModule } from '@modules/subcategory/subcategory.module';
import { ProductModule } from '@modules/product/product.module';
import { ColorModule } from './modules/color/color.module';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    UsersModule,
    RbacModule,
    CategoriesModule,
    SubcategoryModule,
    ProductModule,
    ColorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
