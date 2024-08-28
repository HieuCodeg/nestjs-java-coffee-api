export interface IUploadService {
  uploadImage(file: Express.Multer.File, params: any): Promise<any>;

  destroyImage(publicId: string, params: any): Promise<any>;

  uploadVideo(file: Express.Multer.File, params: any): Promise<any>;

  destroyVideo(publicId: string, params: any): Promise<any>;
}
