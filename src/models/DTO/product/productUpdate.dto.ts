// product-update.dto.ts
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Category } from 'src/models/entities/category.entity';
import { Product } from 'src/models/entities/product.entity';
import { ProductImage } from 'src/models/entities/productImage.entity';
import { Expose } from 'class-transformer';

export class ProductUpdateDTO {
  @Expose()
  @IsOptional()
  id?: number;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập tên sản phẩm.' })
  @Length(5, 50, {
    message: 'Tên sản phẩm có độ dài nằm trong khoảng 5 - 50 ký tự.',
  })
  title: string;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập mô tả sản phẩm.' })
  @Length(5, 500, {
    message: 'Mô tả sản phẩm có độ dài nằm trong khoảng 5 - 500 ký tự.',
  })
  description: string;

  @Expose()
  @IsOptional()
  @IsString()
  summary?: string;

  @Expose()
  @IsOptional()
  @IsString()
  sizes?: string;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng chọn danh mục sản phẩm.' })
  @Matches(/^\d+$/, { message: 'ID danh mục sản phẩm phải là số.' })
  categoryId: string;

  constructor(
    id?: number,
    title?: string,
    description?: string,
    summary?: string,
    sizes?: string,
    categoryId?: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.summary = summary;
    this.sizes = sizes;
    this.categoryId = categoryId;
  }

  toProduct(category: Category, productImage: ProductImage): Product {
    const product = new Product();
    product.id = this.id;
    product.title = this.title;
    product.description = this.description;
    product.summary = this.summary;
    product.category = category;
    product.sizes = this.sizes; // Giả định sizes đã là kiểu dữ liệu phù hợp
    product.productImage = productImage;
    return product;
  }
}
