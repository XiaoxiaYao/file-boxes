import { Module } from '@nestjs/common';
import { CloudStorageProvider } from './cloud-storage.provider';
import { CloudStorageService } from './cloud-storage.service';

@Module({
  providers: [CloudStorageService, CloudStorageProvider],
  exports: [CloudStorageService, CloudStorageProvider],
})
export class CloudStorageModule {}
