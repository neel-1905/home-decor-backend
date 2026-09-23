import { PaginationQueryDto } from '@/common/dto';
import { IsIn, IsOptional } from 'class-validator';

export class UserQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['name', 'email', 'createdAt'])
  sortBy: 'name' | 'email' | 'createdAt' = 'createdAt';
}
