import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { product, wishlist, wishlistProduct } from '@/db/schema';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AddWishlistProductDto } from './dto/add-wishlist-product.dto';

@Injectable()
export class WishlistService {
  async create(userId: string, data: CreateWishlistDto) {
    const [existingWishlist] = await db
      .select({ id: wishlist.id })
      .from(wishlist)
      .where(and(eq(wishlist.userId, userId), eq(wishlist.name, data.name)))
      .limit(1);

    if (existingWishlist) {
      throw new ConflictException(
        'You already have a wishlist with this name.',
      );
    }

    const [newWishlist] = await db
      .insert(wishlist)
      .values({
        userId,
        name: data.name,
        description: data.description,
      })
      .returning({
        id: wishlist.id,
        userId: wishlist.userId,
        name: wishlist.name,
        description: wishlist.description,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      });

    return newWishlist;
  }

  async findAll(userId: string) {
    return db
      .select({
        id: wishlist.id,
        name: wishlist.name,
        description: wishlist.description,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      })
      .from(wishlist)
      .where(eq(wishlist.userId, userId));
  }

  async findById(id: string, userId: string) {
    const [wishlistRecord] = await db
      .select({
        id: wishlist.id,
        name: wishlist.name,
        description: wishlist.description,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      })
      .from(wishlist)
      .where(and(eq(wishlist.id, id), eq(wishlist.userId, userId)))
      .limit(1);

    if (!wishlistRecord) {
      throw new NotFoundException(`Wishlist with ID '${id}' does not exist.`);
    }

    return wishlistRecord;
  }

  async update(id: string, userId: string, data: UpdateWishlistDto) {
    const existingWishlist = await this.findById(id, userId);

    if (data.name && data.name !== existingWishlist.name) {
      const [duplicateWishlist] = await db
        .select({ id: wishlist.id })
        .from(wishlist)
        .where(and(eq(wishlist.userId, userId), eq(wishlist.name, data.name)))
        .limit(1);

      if (duplicateWishlist) {
        throw new ConflictException(
          'You already have a wishlist with this name.',
        );
      }
    }

    const [updatedWishlist] = await db
      .update(wishlist)
      .set({
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        updatedAt: new Date(),
      })
      .where(and(eq(wishlist.id, id), eq(wishlist.userId, userId)))
      .returning({
        id: wishlist.id,
        name: wishlist.name,
        description: wishlist.description,
        createdAt: wishlist.createdAt,
        updatedAt: wishlist.updatedAt,
      });

    return updatedWishlist;
  }

  async remove(id: string, userId: string) {
    const [deletedWishlist] = await db
      .delete(wishlist)
      .where(and(eq(wishlist.id, id), eq(wishlist.userId, userId)))
      .returning({
        id: wishlist.id,
        name: wishlist.name,
      });

    if (!deletedWishlist) {
      throw new NotFoundException(`Wishlist with ID '${id}' does not exist.`);
    }

    return deletedWishlist;
  }

  async addProduct(
    wishlistId: string,
    userId: string,
    data: AddWishlistProductDto,
  ) {
    // Make sure the wishlist belongs to the current user
    const [existingWishlist] = await db
      .select({ id: wishlist.id })
      .from(wishlist)
      .where(and(eq(wishlist.id, wishlistId), eq(wishlist.userId, userId)))
      .limit(1);

    if (!existingWishlist) {
      throw new NotFoundException(
        `Wishlist with ID '${wishlistId}' does not exist.`,
      );
    }

    // Make sure the product exists
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

    // Check if product is already in this wishlist
    const [existingWishlistProduct] = await db
      .select({
        wishlistId: wishlistProduct.wishlistId,
        productId: wishlistProduct.productId,
      })
      .from(wishlistProduct)
      .where(
        and(
          eq(wishlistProduct.wishlistId, wishlistId),
          eq(wishlistProduct.productId, data.productId),
        ),
      )
      .limit(1);

    if (existingWishlistProduct) {
      throw new ConflictException('This product is already in the wishlist.');
    }

    const [addedProduct] = await db
      .insert(wishlistProduct)
      .values({
        wishlistId,
        productId: data.productId,
      })
      .returning({
        wishlistId: wishlistProduct.wishlistId,
        productId: wishlistProduct.productId,
      });

    return addedProduct;
  }

  async findProducts(wishlistId: string, userId: string) {
    // Make sure the wishlist belongs to the current user
    const [existingWishlist] = await db
      .select({ id: wishlist.id })
      .from(wishlist)
      .where(and(eq(wishlist.id, wishlistId), eq(wishlist.userId, userId)))
      .limit(1);

    if (!existingWishlist) {
      throw new NotFoundException(
        `Wishlist with ID '${wishlistId}' does not exist.`,
      );
    }

    return db
      .select({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        images: product.images,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })
      .from(wishlistProduct)
      .innerJoin(product, eq(wishlistProduct.productId, product.id))
      .where(eq(wishlistProduct.wishlistId, wishlistId));
  }

  async removeProduct(wishlistId: string, productId: string, userId: string) {
    // Make sure the wishlist belongs to the current user
    const [existingWishlist] = await db
      .select({ id: wishlist.id })
      .from(wishlist)
      .where(and(eq(wishlist.id, wishlistId), eq(wishlist.userId, userId)))
      .limit(1);

    if (!existingWishlist) {
      throw new NotFoundException(
        `Wishlist with ID '${wishlistId}' does not exist.`,
      );
    }

    const [deletedProduct] = await db
      .delete(wishlistProduct)
      .where(
        and(
          eq(wishlistProduct.wishlistId, wishlistId),
          eq(wishlistProduct.productId, productId),
        ),
      )
      .returning({
        wishlistId: wishlistProduct.wishlistId,
        productId: wishlistProduct.productId,
      });

    if (!deletedProduct) {
      throw new NotFoundException(
        `Product with ID '${productId}' is not in this wishlist.`,
      );
    }

    return deletedProduct;
  }
}
