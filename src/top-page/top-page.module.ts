import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopPage, TopPageSchema } from './schemas/top-page.schema';
import { TopPageService } from './top-page.service';

@Module({
  controllers: [TopPageController],
  imports: [
    MongooseModule.forFeature([
      {
        name: TopPage.name,
        schema: TopPageSchema,
      },
    ]),
  ],
  providers: [TopPageService],
})
export class TopPageModule {}
