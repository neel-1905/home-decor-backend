import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString({
    message: 'Category name must be a string.',
  })
  @IsNotEmpty({
    message: 'Category name is required.',
  })
  name: string;

  @IsString({
    message: 'Category icon must be a string.',
  })
  @IsNotEmpty({
    message: 'Category icon is required.',
  })
  icon: string;
}
