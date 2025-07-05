import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TopPage } from './schemas/top-page.schema';
import { Model } from 'mongoose';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPage.name) private readonly topPageModel: Model<TopPage>,
  ) {}

  async createTopPage(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async deleteTopPageByID(id: string) {
    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async findTopPageById(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async findTopPageByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }

  async updateTopPageById(id: string, dto: CreateTopPageDto) {
    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findTopPages(dto: FindTopPageDto) {
    return this.topPageModel
      .aggregate([
        {
          $match: {
            firstCategory: dto.firstCategory,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
      ])
      .exec();
  }
}
