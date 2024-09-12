import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ProductImage } from 'src/models/entities/productImage.entity';

export class ProductImageDTO {
  @Expose()
  @IsOptional()
  @IsString()
  id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  fileName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  fileFolder?: string;

  @Expose()
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @Expose()
  @IsOptional()
  @IsString()
  fileType?: string;

  @Expose()
  @IsOptional()
  @IsString()
  cloudId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  height?: string;

  @Expose()
  @IsOptional()
  @IsString()
  width?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  ts?: number;

  toProductImage(): ProductImage {
    const productImage = new ProductImage();
    productImage.id = this.id;
    productImage.fileName = this.fileName;
    productImage.fileFolder = this.fileFolder;
    productImage.fileUrl = this.fileUrl;
    productImage.fileType = this.fileType;
    productImage.cloudId = this.cloudId;
    productImage.height = this.height ? parseInt(this.height, 10) : undefined;
    productImage.width = this.width ? parseInt(this.width, 10) : undefined;
    productImage.ts = this.ts;

    return productImage;
  }
}
