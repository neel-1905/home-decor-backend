import { IsIn, IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto.js';

export class ProductQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID('4', {
    message: 'Subcategory ID must be a valid UUID.',
  })
  subcategoryId?: string;

  @IsOptional()
  @IsIn(['name', 'price', 'createdAt'])
  sortBy: 'name' | 'price' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsUUID('4', {
    message: 'Color ID must be a valid UUID.',
  })
  colorId?: string;
}
