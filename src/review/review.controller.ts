import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { Review } from './schemas/review.schema';

@Controller('review')
export class ReviewController {
  @Post('create')
  async create(@Body() dto: Omit<Review, '_id'>) {}

  @Delete(':id')
  async delete(@Param() id: string) {}

  @Get('product/:productId')
  async getByProductId(@Param() productId: string) {}
}
