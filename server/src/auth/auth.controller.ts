import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  UseInterceptors,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongooseClassSerializer.interceptor';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Authentication')
@Controller('auth')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiBody({ type: SignUpDto })
  @UseGuards(LocalAuthGuard)
  @Post('/sign-in')
  signin(@Request() req) {
    const { user } = req;
    const cookie = this.authService.getCookieWithJwtToken(user);
    req.res.setHeader('Set-Cookie', cookie);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/current-user')
  getCurrentUser(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/sign-out')
  logOut(@Request() req) {
    req.res.setHeader('Set-Cookie', this.authService.getCookieForSignOut());
    return '';
  }
}
