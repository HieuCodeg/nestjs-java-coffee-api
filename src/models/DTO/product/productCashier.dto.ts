// product-cashier.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { SizeDTO } from './size.dto';

export class ProductCashierDTO {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SizeDTO)
  sizes?: Map<string, SizeDTO>;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Transform(({ obj }) => obj.category.id)
  categoryId?: number;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ obj }) => obj.productImage.fileUrl)
  photo?: string;

  constructor(
    id?: number,
    title?: string,
    description?: string,
    sizes?: string,
    categoryId?: number,
    photo?: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.sizes = sizes ? JSON.parse(sizes) : undefined; // Chuyển đổi từ JSON string sang Map
    this.categoryId = categoryId;
    this.photo = photo;
  }
}
