import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from 'src/auth/dto/sign-up.dto';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

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

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
