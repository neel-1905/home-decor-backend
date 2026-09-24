import { IsUUID } from 'class-validator';

export class AddWishlistProductDto {
  @IsUUID('4', {
    message: 'Product ID must be a valid UUID.',
  })
  productId: string;
}
