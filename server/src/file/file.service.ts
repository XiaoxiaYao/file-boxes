import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { FileDocument, File } from './schemas/file.schema';
import { Model } from 'mongoose';
import { CloudStorageService } from 'src/cloud-storage/cloud-storage.service';
import mongoose from 'mongoose';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private FileModel: Model<FileDocument>,
    private cloudStorageService: CloudStorageService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async uploadFile(
    fileName: string,
    folder: string,
    file: Express.Multer.File,
  ) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const { public_id, secure_url } =
        await this.cloudStorageService.uploadFile(fileName, folder, file);
      const newFile = new this.FileModel({
        url: secure_url,
        cloudStorageId: public_id,
      });
      await newFile.save({ session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException('Fail to upload the file.');
    } finally {
      session.endSession();
    }
  }

  async deleteFile(fileId: string) {
    const session = await this.connection.startSession();

    session.startTransaction();
    try {
      const file = await this.FileModel.findById(fileId);
      await this.cloudStorageService.deleteFile(file.cloudStorageId);
      const result = await this.FileModel.findByIdAndDelete(fileId);
      if (!result) {
        throw new NotFoundException('Could not find the file.');
      }

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException('Fail to delete the file.');
    } finally {
      session.endSession();
    }
  }
}
