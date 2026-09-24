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
import { ProductService } from './product.service';
import { RequirePermissions, ResponseMessage } from '@/common/decorators';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @RequirePermissions('product:create')
  @ResponseMessage('Product created successfully')
  create(@Body() data: CreateProductDto) {
    return this.productService.create(data);
  }

  @Get()
  @RequirePermissions('product:read')
  @ResponseMessage('Products retrieved successfully')
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @RequirePermissions('product:read')
  @ResponseMessage('Product retrieved successfully')
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Patch(':id')
  @RequirePermissions('product:update')
  @ResponseMessage('Product updated successfully')
  update(@Param('id') id: string, @Body() data: UpdateProductDto) {
    return this.productService.update(id, data);
  }

  @Delete(':id')
  @RequirePermissions('product:delete')
  @ResponseMessage('Product deleted successfully')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
