// product-cashier.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SizeDTO } from './size.dto';

export class ProductCashierDTO {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SizeDTO)
  sizes?: Map<string, SizeDTO>;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsString()
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
