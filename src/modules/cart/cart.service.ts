import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { cart, cartItem, product } from '@/db/schema';

import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  async getOrCreateCart(userId: string) {
    const [existingCart] = await db
      .select({
        id: cart.id,
        userId: cart.userId,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      })
      .from(cart)
      .where(eq(cart.userId, userId))
      .limit(1);

    if (existingCart) {
      return existingCart;
    }

    const [newCart] = await db
      .insert(cart)
      .values({
        userId,
      })
      .returning({
        id: cart.id,
        userId: cart.userId,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
      });

    return newCart;
  }

  async getCart(userId: string) {
    const userCart = await this.getOrCreateCart(userId);

    const items = await db
      .select({
        productId: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        isActive: product.isActive,
        quantity: cartItem.quantity,
      })
      .from(cartItem)
      .innerJoin(product, eq(cartItem.productId, product.id))
      .where(eq(cartItem.cartId, userCart.id));

    return {
      id: userCart.id,
      items,
    };
  }

  async addItem(userId: string, data: AddCartItemDto) {
    const userCart = await this.getOrCreateCart(userId);

    const [existingProduct] = await db
      .select({ id: product.id })
      .from(product)
      .where(eq(product.id, data.productId))
      .limit(1);

    if (!existingProduct) {
      throw new NotFoundException(
        `Product with ID '${data.productId}' does not exist.`,
      );
    }

    const [existingItem] = await db
      .select({
        cartId: cartItem.cartId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      })
      .from(cartItem)
      .where(
        and(
          eq(cartItem.cartId, userCart.id),
          eq(cartItem.productId, data.productId),
        ),
      )
      .limit(1);

    if (existingItem) {
      throw new ConflictException('This product is already in your cart.');
    }

    const [newItem] = await db
      .insert(cartItem)
      .values({
        cartId: userCart.id,
        productId: data.productId,
        quantity: data.quantity,
      })
      .returning({
        cartId: cartItem.cartId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });

    return newItem;
  }

  async updateItem(userId: string, productId: string, data: UpdateCartItemDto) {
    const userCart = await this.getOrCreateCart(userId);

    const [updatedItem] = await db
      .update(cartItem)
      .set({
        quantity: data.quantity,
      })
      .where(
        and(
          eq(cartItem.cartId, userCart.id),
          eq(cartItem.productId, productId),
        ),
      )
      .returning({
        cartId: cartItem.cartId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });

    if (!updatedItem) {
      throw new NotFoundException(
        `Product with ID '${productId}' is not in your cart.`,
      );
    }

    return updatedItem;
  }

  async removeItem(userId: string, productId: string) {
    const userCart = await this.getOrCreateCart(userId);

    const [deletedItem] = await db
      .delete(cartItem)
      .where(
        and(
          eq(cartItem.cartId, userCart.id),
          eq(cartItem.productId, productId),
        ),
      )
      .returning({
        cartId: cartItem.cartId,
        productId: cartItem.productId,
        quantity: cartItem.quantity,
      });

    if (!deletedItem) {
      throw new NotFoundException(
        `Product with ID '${productId}' is not in your cart.`,
      );
    }

    return deletedItem;
  }
}
