import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { User } from 'src/users/schemas/user.schema';
import { File, FileSchema } from 'src/file/schemas/file.schema';

export type BoxDocument = Box & Document;

@Schema()
export class Box {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  owner: User;

  @Prop({ type: FileSchema })
  @Type(() => File)
  file: File;
}

export const BoxSchema = SchemaFactory.createForClass(Box);
