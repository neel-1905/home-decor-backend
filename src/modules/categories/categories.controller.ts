import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { RequirePermissions, ResponseMessage } from '@/common/decorators';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @RequirePermissions('category:read')
  @ResponseMessage('Categories retrieved successfully')
  findAll(@Query() query: CategoryQueryDto) {
    return this.categoriesService.findAll(query);
  }

  @Post()
  @RequirePermissions('category:create')
  @ResponseMessage('Category created successfully')
  create(@Body() data: CreateCategoryDto) {
    return this.categoriesService.create(data);
  }

  @Get(':id')
  @RequirePermissions('category:read')
  @ResponseMessage('Category retrieved successfully')
  findById(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions('category:update')
  @ResponseMessage('Category updated successfully')
  update(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoriesService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('category:delete')
  @ResponseMessage('Category deleted successfully')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
