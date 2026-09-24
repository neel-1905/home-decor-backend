import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { asc, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/db';
import { color } from '@/db/schema';

import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorService {
  async create(data: CreateColorDto) {
    const [existingColor] = await db
      .select({
        id: color.id,
      })
      .from(color)
      .where(eq(color.name, data.name))
      .limit(1);

    if (existingColor) {
      throw new ConflictException(
        `Color with name '${data.name}' already exists.`,
      );
    }

    const [newColor] = await db
      .insert(color)
      .values({
        name: data.name,
        value: data.value,
      })
      .returning({
        id: color.id,
        name: color.name,
        value: color.value,
      });

    return newColor;
  }

  async findAll(page = 1, limit = 20, sortOrder: 'asc' | 'desc' = 'asc') {
    const offset = (page - 1) * limit;

    const orderBy = sortOrder === 'asc' ? asc(color.name) : desc(color.name);

    const colors = await db
      .select({
        id: color.id,
        name: color.name,
        value: color.value,
      })
      .from(color)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const [{ count }] = await db
      .select({
        count: sql<number>`count(*)`,
      })
      .from(color);

    const totalRecords = Number(count);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: colors,
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
    const [colorRecord] = await db
      .select({
        id: color.id,
        name: color.name,
        value: color.value,
      })
      .from(color)
      .where(eq(color.id, id))
      .limit(1);

    if (!colorRecord) {
      throw new NotFoundException(`Color with ID '${id}' does not exist.`);
    }

    return colorRecord;
  }

  async update(id: string, data: UpdateColorDto) {
    const [existingColor] = await db
      .select({
        id: color.id,
      })
      .from(color)
      .where(eq(color.id, id))
      .limit(1);

    if (!existingColor) {
      throw new NotFoundException(`Color with ID '${id}' does not exist.`);
    }

    if (data.name) {
      const [duplicateColor] = await db
        .select({
          id: color.id,
        })
        .from(color)
        .where(sql`${color.name} = ${data.name} AND ${color.id} != ${id}`)
        .limit(1);

      if (duplicateColor) {
        throw new ConflictException(
          `Color with name '${data.name}' already exists.`,
        );
      }
    }

    const [updatedColor] = await db
      .update(color)
      .set({
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.value !== undefined && {
          value: data.value,
        }),
      })
      .where(eq(color.id, id))
      .returning({
        id: color.id,
        name: color.name,
        value: color.value,
      });

    return updatedColor;
  }

  async remove(id: string) {
    const [deletedColor] = await db
      .delete(color)
      .where(eq(color.id, id))
      .returning({
        id: color.id,
        name: color.name,
        value: color.value,
      });

    if (!deletedColor) {
      throw new NotFoundException(`Color with ID '${id}' does not exist.`);
    }

    return deletedColor;
  }
}
