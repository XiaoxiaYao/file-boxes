import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { Box, BoxDocument } from './schemas/box.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { FileService } from 'src/file/file.service';

@Injectable()
export class BoxesService {
  constructor(
    @InjectModel(Box.name) private boxModel: Model<BoxDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly fileService: FileService,
  ) {}

  create(createBoxDto: CreateBoxDto, owner: User) {
    const createdBox = new this.boxModel({
      ...createBoxDto,
      owner,
      private: owner === undefined ? false : true,
    });
    return createdBox.save();
  }

  async findAll() {
    return this.boxModel
      .find({ private: false })
      .populate('owner', '-password');
  }

  async uploadFile(boxId: string, file: Express.Multer.File) {
    const session = await this.connection.startSession();
    session.startTransaction();
    let newBox: Box &
      mongoose.Document<any, any, any> & {
        _id: any;
      };
    let error;
    try {
      let box = await this.boxModel.findById(boxId);
      if (!box) {
        throw new NotFoundException('Box not found.');
      }
      if (box.file) {
        const result = await this.fileService.deleteFile(
          box.file._id.toString(),
          session,
        );
        if (!result) {
          throw new NotFoundException('Could not delete the old file.');
        }
      }

      const uploadedFile = await this.fileService.uploadFile(
        file.originalname,
        SUB_FOLDERS.CSV,
        file,
        session,
      );

      box.file = uploadedFile;
      newBox = await box.save({ session });
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      error = err;
    } finally {
      session.endSession();
      if (error) {
        throw error;
      }
      return newBox;
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} box`;
  }

  async update(id: string, updateBoxDto: UpdateBoxDto, owner: User) {
    try {
      const box = await this.boxModel
        .findByIdAndUpdate(id, updateBoxDto)
        .setOptions({ new: true });
      if (!box) {
        throw new NotFoundException('Box not found.');
      }
      return box;
    } catch (error) {
      throw error;
    }
  }

  async setToPublic(id: string) {
    try {
      const box = await this.boxModel
        .findByIdAndUpdate(id, {
          private: false,
        })
        .setOptions({ new: true });
      if (!box) {
        throw new NotFoundException('Box not found.');
      }
      return box;
    } catch (error) {
      throw error;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} box`;
  }
}

const SUB_FOLDERS = {
  CSV: 'CSV',
};
