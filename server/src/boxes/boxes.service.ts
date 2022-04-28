import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return this.boxModel.find().populate('owner', '-password');
  }

  findOne(id: number) {
    return `This action returns a #${id} box`;
  }

  async update(id: string, updateBoxDto: UpdateBoxDto, owner: User) {
    const box = await this.boxModel
      .findByIdAndUpdate(id, updateBoxDto)
      .setOptions({ overwrite: true, new: true });
    if (!box) {
      throw new NotFoundException('Box not found.');
    }
    return box;
  }

  remove(id: number) {
    return `This action removes a #${id} box`;
  }
}
