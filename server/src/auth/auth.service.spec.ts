import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import mongoose, { Model } from 'mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
        {
          provide: ConfigService,
          useValue: {},
        },
        {
          provide: getModelToken(User.name),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('creates a new user with a salted and hashed password', async () => {
    const email = '1@1.com';
    const password = 'test_password';
    jest.spyOn(userModel, 'find').mockResolvedValue([]);

    const saltedPassword = 'salted.password';
    jest.spyOn(usersService, 'create').mockImplementationOnce(() => {
      let mockedUser = new User();
      mockedUser.email = email;
      mockedUser.password = saltedPassword;
      mockedUser.isSuperUser = false;
      return Promise.resolve(mockedUser) as Promise<
        User &
          mongoose.Document<any, any, any> & {
            _id: any;
          }
      >;
    });

    const signUpDto = { email, password };
    const user = await service.signUp(signUpDto);

    expect(user.password).not.toEqual(password);
    expect(user.password).toEqual(saltedPassword);
  });

  it('throws an error if user signs up with email that is in use', async () => {
    const email = '1@1.com';
    const password = 'test_password';
    let mockedExistingUser = new User();
    mockedExistingUser.email = email;
    jest
      .spyOn(userModel, 'find')
      .mockResolvedValue([mockedExistingUser as UserDocument]);

    try {
      const signUpDto = { email, password };
      await service.signUp(signUpDto);
    } catch (err) {
      expect(err).toBeInstanceOf(ConflictException);
      const error = err as ConflictException;
      expect(error.message).toEqual('The email has been used.');
    }
  });
});
