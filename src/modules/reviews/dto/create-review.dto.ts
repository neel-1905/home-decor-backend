import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID('4', {
    message: 'Product ID must be a valid UUID.',
  })
  productId: string;

  @IsInt({
    message: 'Rating must be an integer.',
  })
  @Min(1, {
    message: 'Rating must be at least 1.',
  })
  @Max(5, {
    message: 'Rating cannot be greater than 5.',
  })
  rating: number;

  @IsString({
    message: 'Review message must be a string.',
  })
  message: string;

  @IsOptional()
  @IsArray({
    message: 'Images must be an array.',
  })
  @IsString({
    each: true,
    message: 'Each image must be a string.',
  })
  images?: string[];
}
