import { Injectable, NotFoundException } from '@nestjs/common';
import { asc, count, desc } from 'drizzle-orm';

import { db } from '@/db';
import { user } from '@/db/schema';
import { UserQueryDto } from './dto/user-query.dto';
import { eq } from 'drizzle-orm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  async findAll(query: UserQueryDto) {
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const offset = (page - 1) * limit;

    const [{ total }] = await db
      .select({
        total: count(),
      })
      .from(user);

    const sortColumn = {
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }[sortBy];

    const order = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .orderBy(order)
      .limit(limit)
      .offset(offset);

    const totalRecords = Number(total);
    const totalPages = Math.ceil(totalRecords / limit);

    return {
      data: users,
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
    const [userRecord] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })
      .from(user)
      .where(eq(user.id, id))
      .limit(1);

    if (!userRecord) {
      throw new NotFoundException(`User with ID '${id}' does not exist.`);
    }

    return userRecord;
  }

  async update(id: string, data: UpdateUserDto) {
    const [updatedUser] = await db
      .update(user)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        roleId: user.roleId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

    if (!updatedUser) {
      throw new NotFoundException(`User with ID '${id}' does not exist.`);
    }

    return updatedUser;
  }

  async remove(id: string) {
    const [deletedUser] = await db
      .delete(user)
      .where(eq(user.id, id))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
      });

    if (!deletedUser) {
      throw new NotFoundException(`User with ID '${id}' does not exist.`);
    }

    return deletedUser;
  }
}
