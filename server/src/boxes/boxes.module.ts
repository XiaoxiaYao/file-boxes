import { Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { BoxesController } from './boxes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Box, BoxSchema } from './schemas/box.schema';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Box.name, schema: BoxSchema }]),
    FileModule,
  ],
  controllers: [BoxesController],
  providers: [BoxesService],
})
export class BoxesModule {}
