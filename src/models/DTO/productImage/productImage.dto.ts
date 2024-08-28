import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { ProductImage } from 'src/models/entities/productImage.entity';

export class ProductImageDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  fileFolder?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsString()
  cloudId?: string;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsString()
  width?: string;

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
