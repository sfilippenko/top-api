import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaMongoose, Types } from 'mongoose';
import { Product } from '../../product/schemas/product.schema';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({
  toJSON: { virtuals: true }, // Включаем виртуальные поля при преобразовании в JSON
  toObject: { virtuals: true }, // И при преобразовании в обычный объект
  timestamps: true,
})
export class Review {
  @Prop()
  name: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  rating: number;

  @Prop({ type: SchemaMongoose.Types.ObjectId, ref: Product.name })
  productId: Types.ObjectId;

  product?: Product;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.virtual('product', {
  ref: 'Product', // Модель, с которой связываем
  localField: 'productId', // Поле в текущей схеме
  foreignField: '_id', // Поле в связанной схеме
  justOne: true, // Возвращаем один документ (не массив)
});
