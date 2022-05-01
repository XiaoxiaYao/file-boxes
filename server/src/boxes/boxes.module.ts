import { forwardRef, Module } from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { BoxesController } from './boxes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Box, BoxSchema } from './schemas/box.schema';
import { FileModule } from 'src/file/file.module';
import { UsersModule } from 'src/users/users.module';
import { OwnerGuard } from './guards/owner.guard';
import { SuperUserGuard } from './guards/super-user.guard';
import { PublicAccessibleGuard } from './guards/public-accessible.guard';
import { AllowedUserGuard } from './guards/allowed-user.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Box.name, schema: BoxSchema }]),
    FileModule,
    forwardRef(() => UsersModule),
  ],
  controllers: [BoxesController],
  providers: [
    BoxesService,
    OwnerGuard,
    SuperUserGuard,
    PublicAccessibleGuard,
    AllowedUserGuard,
  ],
  exports: [BoxesService],
})
export class BoxesModule {}
