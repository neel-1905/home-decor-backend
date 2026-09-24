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
import { ColorModule } from '@modules/color/color.module';
import { ReviewsModule } from '@modules/reviews/reviews.module';
import { WishlistModule } from '@modules/wishlist/wishlist.module';
import { CartModule } from '@modules/cart/cart.module';

@Module({
  imports: [
    AuthModule.forRoot({ auth }),
    UsersModule,
    RbacModule,
    CategoriesModule,
    SubcategoryModule,
    ProductModule,
    ColorModule,
    ReviewsModule,
    WishlistModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
