import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/users/schemas/user.schema';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { Box, BoxDocument } from './schemas/box.schema';
import { Model } from 'mongoose';

@Injectable()
export class BoxesService {
  constructor(@InjectModel(Box.name) private boxModel: Model<BoxDocument>) {}

  create(createBoxDto: CreateBoxDto, owner: User) {
    const createdBox = new this.boxModel({
      ...createBoxDto,
      owner,
    });
    return createdBox.save();
  }

  findAll() {
    return `This action returns all boxes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} box`;
  }

  update(id: number, updateBoxDto: UpdateBoxDto) {
    return `This action updates a #${id} box`;
  }

  remove(id: number) {
    return `This action removes a #${id} box`;
  }
}
