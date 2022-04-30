import { ConflictException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { BoxesService } from 'src/boxes/boxes.service';
import { Box, BoxDocument } from 'src/boxes/schemas/box.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectConnection() private readonly connection: mongoose.Connection,
    @InjectModel(Box.name) private boxModel: Model<BoxDocument>,
    private readonly boxesService: BoxesService,
  ) {}

  async create(signUpDto: SignUpDto) {
    const usersWithSameEmail = await this.userModel.find({
      email: signUpDto.email,
    });
    if (usersWithSameEmail.length > 0) {
      throw new ConflictException('The email has been used.');
    }

    const user = new this.userModel(signUpDto);
    const createdUser = await user.save();
    return createdUser;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async remove(userId: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    let error;
    try {
      let ownedBoxes = await this.boxModel.find({ owner: userId });
      await Promise.all(
        ownedBoxes.map(async (box) => {
          await this.boxesService.remove(box._id);
        }),
      );
      await this.userModel.findByIdAndDelete(userId).session(session);
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      error = err;
    } finally {
      session.endSession();
      if (error) {
        throw error;
      }
      return 'User deleted!';
    }
  }
}
