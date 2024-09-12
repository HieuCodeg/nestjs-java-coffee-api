import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class ReportProductDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: 'Product name must be a valid string.' })
  productName?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'File folder must be a valid string.' })
  fileFolder?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'File name must be a valid string.' })
  fileName?: string;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Size must be a valid string.' })
  size?: string;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Quantity must be a valid number.' })
  @IsPositive({ message: 'Quantity must be a positive number.' })
  quantity?: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Amount must be a valid number.' })
  amount?: number; // Sử dụng number hoặc Decimal

  constructor(
    productName?: string,
    fileFolder?: string,
    fileName?: string,
    size?: string,
    quantity?: number,
    amount?: number,
  ) {
    this.productName = productName;
    this.fileFolder = fileFolder;
    this.fileName = fileName;
    this.size = size;
    this.quantity = quantity;
    this.amount = amount;
  }
}
