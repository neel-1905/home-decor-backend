import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateWishlistDto {
  @IsString({
    message: 'Wishlist name must be a string.',
  })
  @IsNotEmpty({
    message: 'Wishlist name is required.',
  })
  @MaxLength(100, {
    message: 'Wishlist name cannot exceed 100 characters.',
  })
  name: string;

  @IsOptional()
  @IsString({
    message: 'Wishlist description must be a string.',
  })
  @MaxLength(500, {
    message: 'Wishlist description cannot exceed 500 characters.',
  })
  description?: string;
}
