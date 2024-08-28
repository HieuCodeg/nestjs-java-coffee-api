// cloudinary.utils.ts
import { BadRequestException } from '@nestjs/common';

export class CloudinaryUploadUtil {
  readonly STAFF_IMAGE_UPLOAD_FOLDER = 'staff_images';
  readonly PRODUCT_IMAGE_UPLOAD_FOLDER = 'product_images';
  readonly CUSTOMER_IMAGE_UPLOAD_FOLDER = 'customer_images';

  readonly ERROR_IMAGE_UPLOAD =
    'Không thể upload hình ảnh của sản phẩm chưa được lưu.';
  readonly ERROR_IMAGE_DESTROY =
    'Không thể destroy hình ảnh của sản phẩm không xác định.';

  buildImageUploadParams(
    id: string,
    imageFolder: string,
    errorMessage: string,
  ) {
    if (!id) throw new BadRequestException(errorMessage);

    const publicId = `${imageFolder}/${id}`;

    return {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    };
  }

  buildImageDestroyParams(id: string, publicId: string, errorMessage: string) {
    if (!id) throw new BadRequestException(errorMessage);

    return {
      public_id: publicId,
      overwrite: true,
      resource_type: 'image',
    };
  }
}
