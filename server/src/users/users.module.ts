import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Box, BoxSchema } from 'src/boxes/schemas/box.schema';
import { BoxesModule } from 'src/boxes/boxes.module';
import { SuperUserGuard } from 'src/boxes/guards/super-user.guard';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Box.name, schema: BoxSchema },
    ]),
    forwardRef(() => BoxesModule),
  ],
  providers: [UsersService, SuperUserGuard],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
