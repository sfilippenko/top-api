import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { Product } from './schemas/product.schema';

@Controller('product')
export class ProductController {
  @Post('create')
  async create(@Body() dto: Omit<Product, '_id'>) {}

  @Get(':id')
  async get(@Param() id: string) {}

  @Delete(':id')
  async delete(@Param() id: string) {}

  @Patch(':id')
  async update(@Param() id: string, @Body() product: Product) {}

  @Post('find')
  @HttpCode(200)
  async find(@Body() dto: FindProductDto) {}
}
