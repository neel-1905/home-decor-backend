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

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishlistService } from './wishlist.service';
import { AddWishlistProductDto } from './dto/add-wishlist-product.dto';

@Controller('wishlists')
export class WishlistController {
  constructor(private readonly wishlistsService: WishlistService) {}

  @Post()
  @RequirePermissions('wishlist:create')
  @ResponseMessage('Wishlist created successfully')
  create(@Session() session: UserSession, @Body() data: CreateWishlistDto) {
    return this.wishlistsService.create(session.user.id, data);
  }

  @Get()
  @RequirePermissions('wishlist:read')
  @ResponseMessage('Wishlists retrieved successfully')
  findAll(@Session() session: UserSession) {
    return this.wishlistsService.findAll(session.user.id);
  }

  @Get(':id')
  @RequirePermissions('wishlist:read')
  @ResponseMessage('Wishlist retrieved successfully')
  findById(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.wishlistsService.findById(id, session.user.id);
  }

  @Patch(':id')
  @RequirePermissions('wishlist:update')
  @ResponseMessage('Wishlist updated successfully')
  update(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateWishlistDto,
  ) {
    return this.wishlistsService.update(id, session.user.id, data);
  }

  @Delete(':id')
  @RequirePermissions('wishlist:delete')
  @ResponseMessage('Wishlist deleted successfully')
  remove(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.wishlistsService.remove(id, session.user.id);
  }

  @Post(':id/products')
  @RequirePermissions('wishlist:create')
  @ResponseMessage('Product added to wishlist successfully')
  addProduct(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: AddWishlistProductDto,
  ) {
    return this.wishlistsService.addProduct(id, session.user.id, data);
  }

  @Get(':id/products')
  @RequirePermissions('wishlist:read')
  @ResponseMessage('Wishlist products retrieved successfully')
  findProducts(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.wishlistsService.findProducts(id, session.user.id);
  }

  @Delete(':id/products/:productId')
  @RequirePermissions('wishlist:delete')
  @ResponseMessage('Product removed from wishlist successfully')
  removeProduct(
    @Session() session: UserSession,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.wishlistsService.removeProduct(id, productId, session.user.id);
  }
}
