import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPage } from './schemas/top-page.schema';

@Controller('top-page')
export class TopPageController {
  @Post('create')
  async create(@Body() dto: Omit<TopPage, '_id'>) {}

  @Delete(':id')
  async delete(@Param() id: string) {}

  @Get(':id')
  async get(@Param() id: string) {}

  @Patch(':id')
  async update(@Param() id: string, @Body() dto: TopPage) {}

  @Post('find')
  @HttpCode(200)
  async find(@Body() dto: FindTopPageDto) {}
}
