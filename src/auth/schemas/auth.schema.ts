import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema()
export class Auth {
  @Prop({ unique: true })
  email: string;

  @Prop()
  passwordHash: number;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
