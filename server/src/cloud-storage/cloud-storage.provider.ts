import { ConfigService } from '@nestjs/config';
import { ConfigOptions, v2 } from 'cloudinary';

export const CloudStorageProvider = {
  provide: 'Cloudinary',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): ConfigOptions => {
    return v2.config({
      cloud_name: configService.get<string>('CLOUD_STORAGE_NAME'),
      api_key: configService.get<string>('CLOUD_STORAGE_API_KEY'),
      api_secret: configService.get<string>('CLOUD_STORAGE_API_SECRET'),
    });
  },
};
