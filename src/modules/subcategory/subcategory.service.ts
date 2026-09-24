import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { category, subcategory } from '@/db/schema';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { count } from 'drizzle-orm';
import { SubcategoryQueryDto } from './dto/subcategory-query.dto';
import { asc } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoryService {
  async create(data: CreateSubcategoryDto) {
    // Check that the parent category exists
    const [existingCategory] = await db
      .select({
        id: category.id,
      })
      .from(category)
      .where(eq(category.id, data.categoryId))
      .limit(1);

    if (!existingCategory) {
      throw new NotFoundException(
        `Category with ID '${data.categoryId}' does not exist.`,
      );
    }

    // Prevent duplicate name inside the same category
    const [existingSubcategory] = await db
      .select({
        id: subcategory.id,
      })
      .from(subcategory)
      .where(
        and(
          eq(subcategory.categoryId, data.categoryId),
          eq(subcategory.name, data.name),
        ),
      )
      .limit(1);

    if (existingSubcategory) {
      throw new ConflictException(
        `Subcategory with name '${data.name}' already exists.`,
      );
    }

    const [newSubcategory] = await db
      .insert(subcategory)
      .values({
        categoryId: data.categoryId,
        name: data.name,
      })
      .returning({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        name: subcategory.name,
        createdAt: subcategory.createdAt,
        updatedAt: subcategory.updatedAt,
      });

    return newSubcategory;
  }

  // FIND ALL
  async findAll(query: SubcategoryQueryDto) {
    const {
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      categoryId,
    } = query;

    const offset = (page - 1) * limit;

    const conditions = categoryId
      ? eq(subcategory.categoryId, categoryId)
      : undefined;

    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(subcategory)
      .where(conditions);

    const sortColumn = {
      name: subcategory.name,
      createdAt: subcategory.createdAt,
    }[sortBy];

    const order = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const subcategories = await db
      .select({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        name: subcategory.name,
        createdAt: subcategory.createdAt,
        updatedAt: subcategory.updatedAt,
      })
      .from(subcategory)
      .where(conditions)
      .orderBy(order)
      .limit(limit)
      .offset(offset);

    const totalRecords = Number(total);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: subcategories,
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
    const [subcategoryRecord] = await db
      .select({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        name: subcategory.name,
        createdAt: subcategory.createdAt,
        updatedAt: subcategory.updatedAt,
      })
      .from(subcategory)
      .where(eq(subcategory.id, id))
      .limit(1);

    if (!subcategoryRecord) {
      throw new NotFoundException(
        `Subcategory with ID '${id}' does not exist.`,
      );
    }

    return subcategoryRecord;
  }

  async update(id: string, data: UpdateSubcategoryDto) {
    const [existingSubcategory] = await db
      .select({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        name: subcategory.name,
      })
      .from(subcategory)
      .where(eq(subcategory.id, id))
      .limit(1);

    if (!existingSubcategory) {
      throw new NotFoundException(
        `Subcategory with ID '${id}' does not exist.`,
      );
    }

    if (data.categoryId) {
      const [existingCategory] = await db
        .select({
          id: category.id,
        })
        .from(category)
        .where(eq(category.id, data.categoryId))
        .limit(1);

      if (!existingCategory) {
        throw new NotFoundException(
          `Category with ID '${data.categoryId}' does not exist.`,
        );
      }
    }

    const newCategoryId = data.categoryId ?? existingSubcategory.categoryId;

    const newName = data.name ?? existingSubcategory.name;

    const [duplicateSubcategory] = await db
      .select({
        id: subcategory.id,
      })
      .from(subcategory)
      .where(
        and(
          eq(subcategory.categoryId, newCategoryId),
          eq(subcategory.name, newName),
        ),
      )
      .limit(1);

    if (duplicateSubcategory && duplicateSubcategory.id !== id) {
      throw new ConflictException(
        `Subcategory with name '${newName}' already exists in this category.`,
      );
    }

    const [updatedSubcategory] = await db
      .update(subcategory)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(subcategory.id, id))
      .returning({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        name: subcategory.name,
        createdAt: subcategory.createdAt,
        updatedAt: subcategory.updatedAt,
      });

    return updatedSubcategory;
  }

  async remove(id: string) {
    const [deletedSubcategory] = await db
      .delete(subcategory)
      .where(eq(subcategory.id, id))
      .returning({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        name: subcategory.name,
      });

    if (!deletedSubcategory) {
      throw new NotFoundException(
        `Subcategory with ID '${id}' does not exist.`,
      );
    }

    return deletedSubcategory;
  }
}
