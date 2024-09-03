// cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryProvider } from 'src/config/cloudinary.provider';
import { UploadServiceImpl } from 'src/services/upload.service';
import { v2 as cloudinary } from 'cloudinary';

@Module({
  providers: [
    {
      provide: 'Cloudinary',
      useValue: cloudinary,
    },
    CloudinaryProvider,
    UploadServiceImpl,
  ],
  exports: [UploadServiceImpl, 'Cloudinary'],
})
export class CloudinaryModule {}
