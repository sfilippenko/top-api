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
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TelegramService } from '../telegram/telegram.service';

@Controller('review')
export class ReviewController {
  constructor(
    private reviewService: ReviewService,
    private telegramService: TelegramService,
  ) {}

  @Post('create')
  @UsePipes(new ValidationPipe())
  async create(@Body() dto: CreateReviewDto) {
    const createdReview = await this.reviewService.create(dto);
    this.telegramService.sendMessage(
      `Создан отзыва ${createdReview?.name} ${createdReview?.title} ${createdReview?.description} на продукт ${createdReview?.product?.title} с оценкой ${createdReview?.rating}`,
    );
    return createdReview;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deleted = await this.reviewService.delete(id);
    if (!deleted) {
      throw new NotFoundException(REVIEW_NOT_FOUND);
    }

    return deleted;
  }

  @Get('product/:productId')
  async getByProductId(
    @Param('productId', IdValidationPipe) productId: string,
  ) {
    return this.reviewService.findByProductId(productId);
  }
}
