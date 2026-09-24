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

import { RequirePermissions, ResponseMessage } from '@/common/decorators';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { SubcategoryService } from './subcategory.service';
import { SubcategoryQueryDto } from './dto/subcategory-query.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoriesService: SubcategoryService) {}

  @Post()
  @RequirePermissions('subcategory:create')
  @ResponseMessage('Subcategory created successfully')
  create(@Body() data: CreateSubcategoryDto) {
    return this.subcategoriesService.create(data);
  }

  @Get()
  @RequirePermissions('subcategory:read')
  @ResponseMessage('Subcategories retrieved successfully')
  findAll(@Query() query: SubcategoryQueryDto) {
    return this.subcategoriesService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('subcategory:read')
  @ResponseMessage('Subcategory retrieved successfully')
  findById(@Param('id') id: string) {
    return this.subcategoriesService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions('subcategory:update')
  @ResponseMessage('Subcategory updated successfully')
  update(@Param('id') id: string, @Body() data: UpdateSubcategoryDto) {
    return this.subcategoriesService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('subcategory:delete')
  @ResponseMessage('Subcategory deleted successfully')
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(id);
  }
}
