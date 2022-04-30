import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Observable } from 'rxjs';
import { Box, BoxDocument } from '../schemas/box.schema';
import { Model } from 'mongoose';
import mongoose from 'mongoose';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(@InjectModel(Box.name) private boxModel: Model<BoxDocument>) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  async validateRequest(request): Promise<boolean> {
    const { user } = request;
    const { id } = request.params;

    if (!mongoose.isValidObjectId(id)) {
      throw new NotFoundException('id must be a mongodb id');
    }

    let box = await this.boxModel.findOne({ _id: id });
    if (!box) {
      throw new NotFoundException('Box not found.');
    }
    if (!box.owner) {
      return true;
    }
    return user._id === box.owner._id.toString();
  }
}
