import { IsIn, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto.js';

export class CategoryQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['name', 'createdAt'])
  sortBy: 'name' | 'createdAt' = 'createdAt';
}
