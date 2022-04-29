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
  ) {}

  async uploadFile(
    fileName: string,
    folder: string,
    file: Express.Multer.File,
    session: mongoose.ClientSession,
  ) {
    const { public_id, secure_url } = await this.cloudStorageService.uploadFile(
      fileName,
      folder,
      file,
    );
    const newFile = new this.FileModel({
      name: fileName,
      url: secure_url,
      cloudStorageId: public_id,
    });
    return await newFile.save({ session });
  }

  async deleteFile(fileId: string, session: mongoose.ClientSession) {
    const file = await this.FileModel.findById(fileId).session(session);
    await this.cloudStorageService.deleteFile(file.cloudStorageId);
    return await this.FileModel.findByIdAndDelete(fileId).session(session);
  }
}
