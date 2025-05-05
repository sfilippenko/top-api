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
import { ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';

@Controller('product')
export class ProductController {
  @Post('create')
  async create(@Body() dto: Omit<ProductModel, '_id'>) {}

  @Get(':id')
  async get(@Param() id: string) {}

  @Delete(':id')
  async delete(@Param() id: string) {}

  @Patch(':id')
  async update(@Param() id: string, @Body() product: ProductModel) {}

  @Post('find')
  @HttpCode(200)
  async find(@Body() dto: FindProductDto) {}
}
