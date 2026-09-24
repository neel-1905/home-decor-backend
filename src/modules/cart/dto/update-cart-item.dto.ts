import { PartialType } from '@nestjs/mapped-types';
import { AddCartItemDto } from './add-cart-item.dto';

export class UpdateCartItemDto extends PartialType(AddCartItemDto) {}
