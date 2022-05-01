import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { BoxesModule } from 'src/boxes/boxes.module';
import { SuperUserGuard } from 'src/boxes/guards/super-user.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => BoxesModule),
  ],
  providers: [UsersService, SuperUserGuard],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
