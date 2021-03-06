import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { password } = signUpDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    signUpDto.password = hashedPassword;

    const user = await this.usersService.create(signUpDto);
    return user;
  }

  async validateUser(signUpUserDto: SignUpDto): Promise<any> {
    const user = await this.usersService.findOneWithPasswordByEmail(
      signUpUserDto.email,
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isMatch = await bcrypt.compare(signUpUserDto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Wrong password. Please try again.');
    }

    return user;
  }

  getCookieWithJwtToken(user: any) {
    const payload = {
      email: user.email,
      sub: user.id,
      isSuperUser: user.isSuperUser,
    };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${this.configService.get<string>(
      'AUTH_JWT_EXPIRATION',
    )}`;
  }

  public getCookieForSignOut() {
    return `Authentication=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0`;
  }
}
