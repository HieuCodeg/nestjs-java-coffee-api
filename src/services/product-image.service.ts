import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from 'src/models/entities/productImage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async findAll(): Promise<ProductImage[]> {
    return this.productImageRepository.find();
  }

  //   async getById(id: number): Promise<ProductImage | undefined> {
  //     return undefined; // Cần điều chỉnh hoặc loại bỏ nếu không sử dụng
  //   }

  async findById(id: string): Promise<ProductImage | undefined> {
    return this.productImageRepository.findOneBy({ id });
  }

  async save(productImage: ProductImage): Promise<ProductImage> {
    return this.productImageRepository.save(productImage);
  }

  //   async remove(id: number): Promise<void> {
  //     // Implement remove logic if needed
  //   }

  async delete(id: string): Promise<void> {
    await this.productImageRepository.delete(id);
  }
}
