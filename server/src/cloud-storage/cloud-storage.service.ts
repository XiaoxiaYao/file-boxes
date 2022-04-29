import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudStorageService {
  constructor(protected configService: ConfigService) {}

  async uploadFile(
    fileName: string,
    folder: string,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.upload;
      const upload = v2.uploader.upload_stream(
        {
          folder: `${this.configService.get<string>(
            'CLOUD_STORAGE_FOLDER',
          )}/${folder}/`,
          public_id: fileName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }

  async deleteFile(cloudStorageId: string): Promise<any> {
    try {
      const response = await v2.uploader.destroy(cloudStorageId);
      return response;
    } catch (error) {
      throw new BadRequestException('Fail to delete the file.');
    }
  }
}
