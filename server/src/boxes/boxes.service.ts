import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
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
import { ShareBoxDto } from './dto/share-box.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BoxesService {
  constructor(
    @InjectModel(Box.name) private boxModel: Model<BoxDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    private readonly fileService: FileService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  create(createBoxDto: CreateBoxDto, owner: User) {
    const createdBox = new this.boxModel({
      ...createBoxDto,
      owner,
      private: owner === undefined ? false : true,
    });
    return createdBox.save();
  }

  async findAll(user: User) {
    // Unauthenticated users can read public boxes.
    if (!user) {
      return this.boxModel.find({ private: false }).populate('owner');
    }

    // Superuser can read boxes.
    if (user.isSuperUser) {
      return this.boxModel.find().populate('owner');
    }

    // Non super user can read its own or allowed access
    return this.boxModel.find({
      $or: [
        { owner: user._id },
        { private: false },
        { $and: [{ private: true }, { accessAllowedUser: user }] },
      ],
    });
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
      let box = await this.emptyBox(boxId, session);

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

  async findOne(id: string, user: User) {
    const box = await this.boxModel.findById(id);
    if (!box.private) {
      return box;
    }

    if (user) {
      if (user.isSuperUser) {
        return box;
      }

      if (user._id.toString() === box.owner._id.toString()) {
        return box;
      }

      for (const allowedUser of box.accessAllowedUser) {
        if (allowedUser._id.toString() === user._id.toString()) {
          return box;
        }
      }
    }

    throw new ForbiddenException(
      'This is a private box and its not shared to you.',
    );
  }

  async findAllOwned(ownerId: string) {
    return await this.boxModel.find({ owner: ownerId });
  }

  async update(id: string, updateBoxDto: UpdateBoxDto, user: User) {
    const box = await this.boxModel.findById(id);
    if (!box) {
      throw new NotFoundException('Box not found.');
    }
    if (box.private) {
      if (!user) {
        throw new ForbiddenException(
          'You can not update private box as a guest.',
        );
      } else {
        if (user._id.toString() != box.owner._id.toString()) {
          throw new ForbiddenException(
            'You are not the owner. Not allowed to update the box.',
          );
        }
      }
    }

    return await this.boxModel
      .findByIdAndUpdate(id, updateBoxDto)
      .setOptions({ new: true });
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

  async remove(boxId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    let error;
    try {
      await this.emptyBox(boxId, session);
      await this.boxModel.findByIdAndDelete(boxId).session(session);
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      error = err;
    } finally {
      session.endSession();
      if (error) {
        throw error;
      }
      return 'Box deleted!';
    }
  }

  async share(boxId: string, shareBoxDto: ShareBoxDto) {
    try {
      const { email } = shareBoxDto;
      const user = (await this.usersService.findOneByEmail(email)) as User;
      if (!user) {
        throw new NotFoundException('User not found.');
      }

      const box = await this.boxModel.findById(boxId);
      if (!box) {
        throw new NotFoundException('Box not found.');
      }

      for (const allowedUser of box.accessAllowedUser) {
        if (allowedUser._id.toString() === user._id.toString()) {
          throw new ConflictException(
            'You have shared the box to this user. No need to do it again!',
          );
        }
      }

      await box.updateOne({
        $push: {
          accessAllowedUser: user,
        },
      });
      return 'Shared!';
    } catch (error) {
      throw error;
    }
  }

  async emptyBox(boxId: string, session: mongoose.ClientSession) {
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
    return box;
  }
}

const SUB_FOLDERS = {
  CSV: 'CSV',
};
