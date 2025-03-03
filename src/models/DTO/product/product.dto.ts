// product.dto.ts
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { Product } from 'src/models/entities/product.entity';
import { SizeDTO } from './size.dto';
import { CategoryDTO } from '../category/category.dto';
import { ProductImageDTO } from '../productImage/productImage.dto';
import { JsonToMapConverter } from 'src/common/json.to.map';

export class ProductDTO {
  @Expose()
  @IsOptional()
  id?: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  title: string;

  @Expose()
  @IsOptional()
  @IsString()
  summary?: string;

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
  @ValidateNested()
  @Type(() => CategoryDTO)
  category?: CategoryDTO;

  @Expose()
  @IsOptional()
  @ValidateNested()
  @Type(() => ProductImageDTO)
  productImage?: ProductImageDTO;

  constructor(
    id?: number,
    title?: string,
    description?: string,
    summary?: string,
    sizes?: string,
    category?: CategoryDTO,
    productImage?: ProductImageDTO,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.summary = summary;
    this.sizes = JsonToMapConverter.convertToDatabaseColumn(sizes) as Map<
      string,
      SizeDTO
    >;
    this.category = category;
    this.productImage = productImage;
  }

  toProduct(): Product {
    const product = new Product();
    product.id = this.id;
    product.title = this.title;
    product.description = this.description;
    product.summary = this.summary;
    product.sizes = JsonToMapConverter.convertToEntityAttribute(this.sizes);
    product.category = this.category ? this.category.toCategory() : undefined;
    product.productImage = this.productImage
      ? this.productImage.toProductImage()
      : undefined;

    return product;
  }
}
