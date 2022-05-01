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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('Authentication')
@Controller('auth')
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
