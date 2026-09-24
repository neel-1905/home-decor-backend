import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString({
    message: 'Product name must be a string.',
  })
  @IsNotEmpty({
    message: 'Product name is required.',
  })
  name: string;

  @IsString({
    message: 'Product description must be a string.',
  })
  @IsNotEmpty({
    message: 'Product description is required.',
  })
  description: string;

  @IsNumber(
    {},
    {
      message: 'Product price must be a number.',
    },
  )
  @Min(0, {
    message: 'Product price cannot be negative.',
  })
  price: number;

  @IsArray({
    message: 'Images must be an array.',
  })
  @IsString({
    each: true,
    message: 'Each image must be a string.',
  })
  images: string[];

  @IsOptional()
  @IsBoolean({
    message: 'isActive must be a boolean.',
  })
  isActive?: boolean;

  @IsArray({
    message: 'Subcategory IDs must be an array.',
  })
  @IsUUID('4', {
    each: true,
    message: 'Each subcategory ID must be a valid UUID.',
  })
  subcategoryIds: string[];
}
