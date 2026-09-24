import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateSubcategoryDto {
  @IsUUID(undefined, {
    message: 'Category ID must be a valid UUID.',
  })
  categoryId: string;

  @IsString({
    message: 'Subcategory name must be a string.',
  })
  @IsNotEmpty({
    message: 'Subcategory name is required.',
  })
  name: string;
}
