import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { TOP_PAGE_NOT_FOUND } from './top-page.consntants';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
  constructor(private topPageService: TopPageService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtGuard)
  @Post('create')
  async create(@Body() dto: CreateTopPageDto) {
    return this.topPageService.createTopPage(dto);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async delete(@Param('id', IdValidationPipe) id: string) {
    const deletedTopPage = await this.topPageService.deleteTopPageByID(id);
    if (!deletedTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
    return deletedTopPage;
  }

  @Get(':id')
  async get(@Param('id', IdValidationPipe) id: string) {
    const foundTopPage = await this.topPageService.findTopPageById(id);
    if (!foundTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
    return foundTopPage;
  }

  @Get('/get-by-alias/:alias')
  async getByAlias(@Param('alias') alias: string) {
    const foundTopPage = await this.topPageService.findTopPageByAlias(alias);
    if (!foundTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
    return foundTopPage;
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async update(
    @Param('id', IdValidationPipe) id: string,
    @Body() dto: CreateTopPageDto,
  ) {
    const foundTopPage = await this.topPageService.updateTopPageById(id, dto);
    if (!foundTopPage) {
      throw new NotFoundException(TOP_PAGE_NOT_FOUND);
    }
    return foundTopPage;
  }

  @UsePipes(new ValidationPipe())
  @Post('find')
  @HttpCode(200)
  async find(@Body() dto: FindTopPageDto) {
    return this.topPageService.findTopPages(dto);
  }
}
