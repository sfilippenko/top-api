import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum TopLevelCategory {
  Courses,
  Services,
  Books,
  Products,
}

export class TopPageAdvantage {
  @Prop()
  title: string;

  @Prop()
  description: string;
}

export class HhData {
  @Prop()
  count: number;

  @Prop()
  juniorSalary: number;

  @Prop()
  middleSalary: number;

  @Prop()
  seniorSalary: number;

  @Prop()
  updatedAt: Date;
}

@Schema({ timestamps: true })
export class TopPage {
  @Prop({ enum: TopLevelCategory })
  firstCategory: TopLevelCategory;

  @Prop()
  secondCategory: string;

  @Prop({ unique: true })
  alias: string;

  @Prop()
  title: string;

  @Prop()
  category: string;

  @Prop(HhData)
  hh?: HhData;

  @Prop([TopPageAdvantage])
  advantages?: TopPageAdvantage[];

  @Prop()
  seoText: string;

  @Prop()
  tagsTitle: string;

  @Prop([String])
  tags: string[];
}

export const TopPageSchema = SchemaFactory.createForClass(TopPage);

TopPageSchema.index({
  title: 'text',
  seoText: 'text',
  'advantages.title': 'text',
  'advantages.description': 'text',
});
