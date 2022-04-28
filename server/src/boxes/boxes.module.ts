import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { BoxesController } from './boxes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Box, BoxSchema } from './schemas/box.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Box.name, schema: BoxSchema }])],
  controllers: [BoxesController],
  providers: [BoxesService],
})
export class BoxesModule {}
