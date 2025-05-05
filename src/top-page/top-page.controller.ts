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
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Controller('top-page')
export class TopPageController {
  @Post('create')
  async create(@Body() dto: Omit<TopPageModel, '_id'>) {}

  @Delete(':id')
  async delete(@Param() id: string) {}

  @Get(':id')
  async get(@Param() id: string) {}

  @Patch(':id')
  async update(@Param() id: string, @Body() dto: TopPageModel) {}

  @Post('find')
  @HttpCode(200)
  async find(@Body() dto: FindTopPageDto) {}
}
