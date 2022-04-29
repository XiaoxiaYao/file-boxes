import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxesModule } from './boxes/boxes.module';
import { CloudStorageModule } from './cloud-storage/cloud-storage.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        PORT: Joi.number().default(4000),
        MONGODB_URI: Joi.string().required(),
        AUTH_JWT_SECRET: Joi.string().required(),
        AUTH_JWT_EXPIRATION: Joi.string().required(),
        CLOUD_STORAGE_NAME: Joi.string().required(),
        CLOUD_STORAGE_API_KEY: Joi.string().required(),
        CLOUD_STORAGE_API_SECRET: Joi.string().required(),
        CLOUD_STORAGE_FOLDER: Joi.string().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    BoxesModule,
    CloudStorageModule,
    FileModule,
  ],
})
export class AppModule {}
