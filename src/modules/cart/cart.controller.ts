import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

import { RequirePermissions } from '@/common/decorators/permission.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @RequirePermissions('cart:read')
  @ResponseMessage('Cart retrieved successfully')
  getCart(@Session() session: UserSession) {
    return this.cartService.getCart(session.user.id);
  }

  @Post('items')
  @RequirePermissions('cart:create')
  @ResponseMessage('Product added to cart successfully')
  addItem(@Session() session: UserSession, @Body() data: AddCartItemDto) {
    return this.cartService.addItem(session.user.id, data);
  }

  @Patch('items/:productId')
  @RequirePermissions('cart:update')
  @ResponseMessage('Cart item updated successfully')
  updateItem(
    @Session() session: UserSession,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() data: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(session.user.id, productId, data);
  }

  @Delete('items/:productId')
  @RequirePermissions('cart:delete')
  @ResponseMessage('Product removed from cart successfully')
  removeItem(
    @Session() session: UserSession,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.cartService.removeItem(session.user.id, productId);
  }
}
