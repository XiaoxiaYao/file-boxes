import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop()
  url: string;

  @Prop()
  cloudStorageId: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
