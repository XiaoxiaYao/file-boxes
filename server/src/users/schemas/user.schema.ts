import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ default: false })
  isSuperUser: boolean;
  mockedUser: import('mongoose').Types.ObjectId;
}

let TempUserSchema = SchemaFactory.createForClass(User);
TempUserSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserSchema = TempUserSchema;
