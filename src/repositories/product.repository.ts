import { Injectable } from '@nestjs/common';
import { ProductDTO } from 'src/models/DTO/product/product.dto';
import { ProductCashierDTO } from 'src/models/DTO/product/productCashier.dto';
import { Product } from 'src/models/entities/product.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class ProductRepository extends Repository<Product> {
  async getAllProductDTOWhereDeletedIsFalse(): Promise<ProductDTO[]> {
    return this.createQueryBuilder('pd')
      .select([
        'pd.id',
        'pd.title',
        'pd.description',
        'pd.summary',
        'pd.sizes',
        'pd.category',
        'pd.productImage',
      ])
      .where('pd.deleted = :deleted', { deleted: false })
      .getRawMany(); // Sử dụng getRawMany để lấy kết quả dạng DTO
  }

  async getAllProductCashierDTOWhereDeletedIsFalse(): Promise<
    ProductCashierDTO[]
  > {
    return this.createQueryBuilder('pd')
      .select([
        'pd.id',
        'pd.title',
        'pd.description',
        'pd.sizes',
        'pd.category.id',
        'pd.productImage.fileUrl',
      ])
      .where('pd.deleted = :deleted', { deleted: false })
      .getRawMany(); // Sử dụng getRawMany để lấy kết quả dạng DTO
  }

  async softDelete(productId: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(Product)
      .set({ deleted: true })
      .where('id = :productId', { productId })
      .execute();
  }

  async existsByTitle(title: string): Promise<boolean> {
    const count = await this.createQueryBuilder('pd')
      .where('pd.title = :title', { title })
      .getCount();
    return count > 0;
  }

  async existsByTitleAndIdNot(title: string, id: number): Promise<boolean> {
    const count = await this.createQueryBuilder('pd')
      .where('pd.title = :title', { title })
      .andWhere('pd.id != :id', { id })
      .getCount();
    return count > 0;
  }
}
