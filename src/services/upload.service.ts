// cloudinary.service.ts
import { Inject, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class UploadServiceImpl {
  constructor(
    @Inject('Cloudinary')
    private readonly cloudinaryInstance: typeof cloudinary,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    options: Record<string, any>,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinaryInstance.uploader
        .upload_stream(options, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });
  }

  async destroyImage(
    publicId: string,
    options: Record<string, any>,
  ): Promise<any> {
    return this.cloudinaryInstance.uploader.destroy(publicId, options);
  }

  async uploadVideo(
    file: Express.Multer.File,
    options: Record<string, any>,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinaryInstance.uploader
        .upload_stream(options, (error, result) => {
          if (error) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });
  }

  async destroyVideo(
    publicId: string,
    options: Record<string, any>,
  ): Promise<any> {
    return this.cloudinaryInstance.uploader.destroy(publicId, options);
  }
}
