import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, asc, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { product, review, user } from '@/db/schema';

import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  async create(userId: string, data: CreateReviewDto) {
    // Check product exists
    const [existingProduct] = await db
      .select({
        id: product.id,
      })
      .from(product)
      .where(eq(product.id, data.productId))
      .limit(1);

    if (!existingProduct) {
      throw new NotFoundException(
        `Product with ID '${data.productId}' does not exist.`,
      );
    }

    // Check user hasn't already reviewed this product
    const [existingReview] = await db
      .select({
        id: review.id,
      })
      .from(review)
      .where(
        and(eq(review.userId, userId), eq(review.productId, data.productId)),
      )
      .limit(1);

    if (existingReview) {
      throw new ConflictException('You have already reviewed this product.');
    }

    const [newReview] = await db
      .insert(review)
      .values({
        userId,
        productId: data.productId,
        rating: data.rating,
        message: data.message,
        images: data.images,
      })
      .returning({
        id: review.id,
        productId: review.productId,
        userId: review.userId,
        rating: review.rating,
        message: review.message,
        images: review.images,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      });

    return newReview;
  }

  async findAll(
    page = 1,
    limit = 20,
    sortOrder: 'asc' | 'desc' = 'desc',
    productId?: string,
  ) {
    const offset = (page - 1) * limit;

    const conditions = [];

    if (productId) {
      conditions.push(eq(review.productId, productId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orderBy =
      sortOrder === 'asc' ? asc(review.createdAt) : desc(review.createdAt);

    const reviews = await db
      .select({
        id: review.id,
        productId: review.productId,
        userId: review.userId,
        userName: user.name,
        rating: review.rating,
        message: review.message,
        images: review.images,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })
      .from(review)
      .innerJoin(user, eq(review.userId, user.id))
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(review)
      .where(whereClause);

    const totalRecords = Number(count);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: reviews,
      meta: {
        total_records: totalRecords,
        per_page: limit,
        current_page: page,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_prev_page: page > 1,
      },
    };
  }

  async findById(id: string) {
    const [reviewRecord] = await db
      .select({
        id: review.id,
        productId: review.productId,
        userId: review.userId,
        userName: user.name,
        rating: review.rating,
        message: review.message,
        images: review.images,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      })
      .from(review)
      .innerJoin(user, eq(review.userId, user.id))
      .where(eq(review.id, id))
      .limit(1);

    if (!reviewRecord) {
      throw new NotFoundException(`Review with ID '${id}' does not exist.`);
    }

    return reviewRecord;
  }

  async update(id: string, userId: string, data: UpdateReviewDto) {
    const [existingReview] = await db
      .select({
        id: review.id,
        userId: review.userId,
      })
      .from(review)
      .where(eq(review.id, id))
      .limit(1);

    if (!existingReview) {
      throw new NotFoundException(`Review with ID '${id}' does not exist.`);
    }

    if (existingReview.userId !== userId) {
      throw new ConflictException('You can only update your own review.');
    }

    const [updatedReview] = await db
      .update(review)
      .set({
        ...(data.rating !== undefined && {
          rating: data.rating,
        }),
        ...(data.message !== undefined && {
          message: data.message,
        }),
        ...(data.images !== undefined && {
          images: data.images,
        }),
        updatedAt: new Date(),
      })
      .where(eq(review.id, id))
      .returning({
        id: review.id,
        productId: review.productId,
        userId: review.userId,
        rating: review.rating,
        message: review.message,
        images: review.images,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      });

    return updatedReview;
  }

  async remove(id: string, userId: string) {
    const [existingReview] = await db
      .select({
        id: review.id,
        userId: review.userId,
      })
      .from(review)
      .where(eq(review.id, id))
      .limit(1);

    if (!existingReview) {
      throw new NotFoundException(`Review with ID '${id}' does not exist.`);
    }

    if (existingReview.userId !== userId) {
      throw new ConflictException('You can only delete your own review.');
    }

    const [deletedReview] = await db
      .delete(review)
      .where(eq(review.id, id))
      .returning({
        id: review.id,
        productId: review.productId,
        rating: review.rating,
        message: review.message,
      });

    return deletedReview;
  }
}
