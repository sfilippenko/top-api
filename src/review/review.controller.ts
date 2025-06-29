import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  Get,
  UsePipes,
  ValidationPipe,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateReviewDto) {
    return this.reviewService.create(dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.reviewService.delete(id);
    if (!deleted) {
      throw new NotFoundException(REVIEW_NOT_FOUND);
    }

    return deleted;
  }

  @Get('product/:productId')
  async getByProductId(@Param('productId') productId: string) {
    return this.reviewService.findByProductId(productId);
  }
}
