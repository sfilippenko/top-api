import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  HttpCode,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductService } from './product.service';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  @Post('create')
  async create(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const product = await this.productService.findProductById(id);
    if (!product) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return product;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deleted = await this.productService.deleteProductById(id);
    if (!deleted) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return deleted;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateProductDto,
  ) {
    const updated = await this.productService.updateProductById(id, dto);
    if (!updated) {
      throw new NotFoundException(PRODUCT_NOT_FOUND);
    }
    return updated;
  }

  @UsePipes(new ValidationPipe())
  @Post('find')
  @HttpCode(200)
  async find(@Body() dto: FindProductDto) {
    return this.productService.findWithReviews(dto);
  }
}
