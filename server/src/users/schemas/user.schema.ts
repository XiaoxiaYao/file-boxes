import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  email: string;

  @Prop()
  @Exclude()
  password: string;

  @Prop({ default: false })
  isSuperUser: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
