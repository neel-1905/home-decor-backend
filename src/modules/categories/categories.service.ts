import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { asc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { category } from '@/db/schema';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { count } from 'drizzle-orm';
import { desc } from 'drizzle-orm';
import { CategoryQueryDto } from './dto/category-query.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  async create(data: CreateCategoryDto) {
    const [existingCategory] = await db
      .select({
        id: category.id,
      })
      .from(category)
      .where(eq(category.name, data.name))
      .limit(1);

    if (existingCategory) {
      throw new ConflictException(
        `Category with name '${data.name}' already exists.`,
      );
    }

    const [newCategory] = await db
      .insert(category)
      .values({
        name: data.name,
        icon: data.icon,
      })
      .returning({
        id: category.id,
        name: category.name,
        icon: category.icon,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      });

    return newCategory;
  }

  async findAll(query: CategoryQueryDto) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const offset = (page - 1) * limit;

    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(category);

    const sortColumn = {
      name: category.name,
      createdAt: category.createdAt,
    }[sortBy];

    const order = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const categories = await db
      .select({
        id: category.id,
        name: category.name,
        icon: category.icon,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })
      .from(category)
      .orderBy(order)
      .limit(limit)
      .offset(offset);

    const totalRecords = Number(total);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: categories,
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
    const [categoryRecord] = await db
      .select({
        id: category.id,
        name: category.name,
        icon: category.icon,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })
      .from(category)
      .where(eq(category.id, id))
      .limit(1);

    if (!categoryRecord) {
      throw new NotFoundException(`Category with ID '${id}' does not exist.`);
    }

    return categoryRecord;
  }

  async update(id: string, data: UpdateCategoryDto) {
    const [existingCategory] = await db
      .select({
        id: category.id,
        name: category.name,
      })
      .from(category)
      .where(eq(category.id, id))
      .limit(1);

    if (!existingCategory) {
      throw new NotFoundException(`Category with ID '${id}' does not exist.`);
    }

    if (data.name && data.name !== existingCategory.name) {
      const [duplicateCategory] = await db
        .select({
          id: category.id,
        })
        .from(category)
        .where(eq(category.name, data.name))
        .limit(1);

      if (duplicateCategory) {
        throw new ConflictException(
          `Category with name '${data.name}' already exists.`,
        );
      }
    }

    const [updatedCategory] = await db
      .update(category)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(category.id, id))
      .returning({
        id: category.id,
        name: category.name,
        icon: category.icon,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      });

    return updatedCategory;
  }

  async remove(id: string) {
    const [deletedCategory] = await db
      .delete(category)
      .where(eq(category.id, id))
      .returning({
        id: category.id,
        name: category.name,
        icon: category.icon,
      });

    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID '${id}' does not exist.`);
    }

    return deletedCategory;
  }
}
