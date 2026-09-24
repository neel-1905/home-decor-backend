import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { RequirePermissions } from '@/common/decorators/permission.decorator';
import { ResponseMessage } from '@/common/decorators/response-message.decorator';

import { ColorService } from './color.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorService) {}

  @Post()
  @RequirePermissions('color:create')
  @ResponseMessage('Color created successfully')
  create(@Body() data: CreateColorDto) {
    return this.colorsService.create(data);
  }

  @Get()
  @RequirePermissions('color:read')
  @ResponseMessage('Colors retrieved successfully')
  findAll(@Query() query: PaginationQueryDto) {
    return this.colorsService.findAll(query.page, query.limit, query.sortOrder);
  }

  @Get(':id')
  @RequirePermissions('color:read')
  @ResponseMessage('Color retrieved successfully')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.colorsService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions('color:update')
  @ResponseMessage('Color updated successfully')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() data: UpdateColorDto) {
    return this.colorsService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('color:delete')
  @ResponseMessage('Color deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.colorsService.remove(id);
  }
}
