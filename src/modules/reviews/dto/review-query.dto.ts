import { IsOptional, IsUUID } from 'class-validator';

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class ReviewQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsUUID('4', {
    message: 'Product ID must be a valid UUID.',
  })
  productId?: string;
}
