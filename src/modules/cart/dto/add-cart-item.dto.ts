import { IsInt, IsUUID, Min } from 'class-validator';

export class AddCartItemDto {
  @IsUUID('4', {
    message: 'Product ID must be a valid UUID.',
  })
  productId: string;

  @IsInt({
    message: 'Quantity must be an integer.',
  })
  @Min(1, {
    message: 'Quantity must be at least 1.',
  })
  quantity: number;
}
