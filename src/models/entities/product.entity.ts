import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { BaseEntity } from './baseEntity';
import { ProductImage } from './productImage.entity';
import { ProductDTO } from '../DTO/product/product.dto';
import { JsonToMapConverter } from 'src/common/json.to.map';
import { SizeDTO } from '../DTO/product/size.dto';
import { ProductCashierDTO } from '../DTO/product/productCashier.dto';

@Entity('products')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  title: string;

  @Column({ nullable: true })
  summary: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  sizes: string;

  @OneToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToOne(() => ProductImage)
  @JoinColumn({ name: 'product_image_id' })
  productImage: ProductImage;

  toProductDTO(): ProductDTO {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      summary: this.summary,
      sizes: JsonToMapConverter.convertToDatabaseColumn(this.sizes) as Map<
        string,
        SizeDTO
      >,
      category: this.category.toCategoryDTO(),
      productImage: this.productImage.toProductImageDTO(),
    } as ProductDTO;
  }

  toProductCashierDTO(): ProductCashierDTO {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      sizes: JsonToMapConverter.convertToDatabaseColumn(this.sizes) as Map<
        string,
        SizeDTO
      >,
      categoryId: this.category.id,
      photo: this.productImage.fileUrl,
    };
  }
}
