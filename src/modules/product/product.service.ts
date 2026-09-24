import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq, inArray } from 'drizzle-orm';

import { db } from '@/db';
import { product, productSubcategory, subcategory } from '@/db/schema';

import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  async create(data: CreateProductDto) {
    return await db.transaction(async (tx) => {
      // 1. Check product name
      const [existingProduct] = await tx
        .select({
          id: product.id,
        })
        .from(product)
        .where(eq(product.name, data.name))
        .limit(1);

      if (existingProduct) {
        throw new ConflictException(
          `Product with name '${data.name}' already exists.`,
        );
      }

      // 2. Validate subcategories
      const subcategories = await tx
        .select({
          id: subcategory.id,
        })
        .from(subcategory)
        .where(inArray(subcategory.id, data.subcategoryIds));

      if (subcategories.length !== data.subcategoryIds.length) {
        throw new NotFoundException('One or more subcategories do not exist.');
      }

      // 3. Create product
      const [newProduct] = await tx
        .insert(product)
        .values({
          name: data.name,
          description: data.description,
          price: data.price.toString(),
          images: data.images,
          isActive: data.isActive ?? true,
        })
        .returning({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          isActive: product.isActive,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        });

      // 4. Create product ↔ subcategory relationships
      await tx.insert(productSubcategory).values(
        data.subcategoryIds.map((subcategoryId) => ({
          productId: newProduct.id,
          subcategoryId,
        })),
      );

      return {
        ...newProduct,
        subcategoryIds: data.subcategoryIds,
      };
    });
  }

  // FIND ALL
  async findAll(query: ProductQueryDto) {
    const {
      page = 1,
      limit = 20,
      sortOrder = 'desc',
      sortBy = 'createdAt',
      subcategoryId,
    } = query;

    const offset = (page - 1) * limit;

    const orderColumn = {
      name: product.name,
      price: product.price,
      createdAt: product.createdAt,
    }[sortBy];

    const orderBy = sortOrder === 'asc' ? asc(orderColumn) : desc(orderColumn);

    const conditions = [];

    if (subcategoryId) {
      conditions.push(eq(productSubcategory.subcategoryId, subcategoryId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const products = await db
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
      .from(product)
      .leftJoin(
        productSubcategory,
        eq(product.id, productSubcategory.productId),
      )
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({
        count: sql<number>`count(distinct ${product.id})`,
      })
      .from(product)
      .leftJoin(
        productSubcategory,
        eq(product.id, productSubcategory.productId),
      )
      .where(whereClause);

    const totalRecords = Number(count);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: products,
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
    const [productRecord] = await db
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
      .from(product)
      .where(eq(product.id, id))
      .limit(1);

    if (!productRecord) {
      throw new NotFoundException(`Product with ID '${id}' does not exist.`);
    }

    const subcategories = await db
      .select({
        id: productSubcategory.subcategoryId,
      })
      .from(productSubcategory)
      .where(eq(productSubcategory.productId, id));

    return {
      ...productRecord,
      subcategoryIds: subcategories.map((item) => item.id),
    };
  }

  async update(id: string, data: UpdateProductDto) {
    return await db.transaction(async (tx) => {
      // 1. Check product exists
      const [existingProduct] = await tx
        .select({
          id: product.id,
        })
        .from(product)
        .where(eq(product.id, id))
        .limit(1);

      if (!existingProduct) {
        throw new NotFoundException(`Product with ID '${id}' does not exist.`);
      }

      // 2. Check duplicate product name
      if (data.name) {
        const [duplicateProduct] = await tx
          .select({
            id: product.id,
          })
          .from(product)
          .where(and(eq(product.name, data.name), sql`${product.id} != ${id}`))
          .limit(1);

        if (duplicateProduct) {
          throw new ConflictException(
            `Product with name '${data.name}' already exists.`,
          );
        }
      }

      // 3. Validate subcategories if provided
      if (data.subcategoryIds) {
        const subcategories = await tx
          .select({
            id: subcategory.id,
          })
          .from(subcategory)
          .where(inArray(subcategory.id, data.subcategoryIds));

        if (subcategories.length !== data.subcategoryIds.length) {
          throw new NotFoundException(
            'One or more subcategories do not exist.',
          );
        }
      }

      // 4. Update product fields
      const [updatedProduct] = await tx
        .update(product)
        .set({
          ...(data.name !== undefined && {
            name: data.name,
          }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.price !== undefined && {
            price: data.price.toString(),
          }),
          ...(data.images !== undefined && {
            images: data.images,
          }),
          ...(data.isActive !== undefined && {
            isActive: data.isActive,
          }),
          updatedAt: new Date(),
        })
        .where(eq(product.id, id))
        .returning({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          images: product.images,
          isActive: product.isActive,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        });

      // 5. Replace subcategory relationships if provided
      if (data.subcategoryIds !== undefined) {
        await tx
          .delete(productSubcategory)
          .where(eq(productSubcategory.productId, id));

        if (data.subcategoryIds.length > 0) {
          await tx.insert(productSubcategory).values(
            data.subcategoryIds.map((subcategoryId) => ({
              productId: id,
              subcategoryId,
            })),
          );
        }
      }

      return {
        ...updatedProduct,
        ...(data.subcategoryIds !== undefined && {
          subcategoryIds: data.subcategoryIds,
        }),
      };
    });
  }

  async remove(id: string) {
    const [deletedProduct] = await db
      .delete(product)
      .where(eq(product.id, id))
      .returning({
        id: product.id,
        name: product.name,
        description: product.description,
      });

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID '${id}' does not exist.`);
    }

    return deletedProduct;
  }
}
