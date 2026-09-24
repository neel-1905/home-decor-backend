import { IsIn, IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto.js';

export class SubcategoryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID(undefined, {
    message: 'Category ID must be a valid UUID.',
  })
  categoryId?: string;

  @IsOptional()
  @IsIn(['name', 'createdAt'])
  sortBy: 'name' | 'createdAt' = 'createdAt';
}
