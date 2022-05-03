import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { SuperUserGuard } from 'src/boxes/guards/super-user.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import ParamsWithId from 'src/utils/paramsWithId';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiParam({
    required: true,
    name: 'id',
    type: 'string',
  })
  @Delete(':id')
  @UseGuards(SuperUserGuard)
  @UseGuards(JwtAuthGuard)
  remove(@Param() { id }: ParamsWithId) {
    return this.usersService.remove(id);
  }

  @Get()
  @UseGuards(SuperUserGuard)
  @UseGuards(JwtAuthGuard)
  users() {
    return this.usersService.findAll();
  }
}
