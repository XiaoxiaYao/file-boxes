import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileSchema, File } from './schemas/file.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudStorageModule } from 'src/cloud-storage/cloud-storage.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    CloudStorageModule,
  ],
  controllers: [FileController],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
