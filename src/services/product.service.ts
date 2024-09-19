import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryUploadUtil } from 'src/common/cloudinary.utils';
import { ProductDTO } from 'src/models/DTO/product/product.dto';
import { ProductCashierDTO } from 'src/models/DTO/product/productCashier.dto';
import { ProductCreateDTO } from 'src/models/DTO/product/productCreate.dto';
import { Product } from 'src/models/entities/product.entity';
import { ProductImage } from 'src/models/entities/productImage.entity';
import { EnumFileType } from 'src/models/enums/enumFileType';
import { Repository } from 'typeorm';
import { CategoryServiceImpl } from './category.service';
import { ProductImageService } from './product-image.service';
import { UploadServiceImpl } from './upload.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProductService {
  private readonly DEFAULT_PRODUCT_IMAGE_ID = 'default-product-image';

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly categoryService: CategoryServiceImpl,
    private readonly productImageService: ProductImageService,
    private readonly uploadService: UploadServiceImpl,
    private readonly cloudinaryUploadUtil: CloudinaryUploadUtil,
  ) {}

  async getAllProductDTOWhereDeletedIsFalse(): Promise<ProductDTO[]> {
    const products = await this.productRepository.find({
      where: { deleted: false },
      relations: ['category', 'productImage'],
    });
    return products.map((product) => {
      // Chuyển đổi entity thành DTO, chỉ giữ lại các trường được định nghĩa trong DTO
      const productDTO = plainToInstance(ProductDTO, product, {
        excludeExtraneousValues: true, // Chỉ giữ lại các trường được định nghĩa trong DTO
      });
      // Kiểm tra và parse sizes nếu cần
      if (typeof product.sizes === 'string') {
        productDTO.sizes = JSON.parse(product.sizes);
      } else {
        productDTO.sizes = product.sizes;
      }
      return productDTO;
    });
  }

  async getAllProductCashierDTOWhereDeletedIsFalse(): Promise<
    ProductCashierDTO[]
  > {
    return this.productRepository
      .createQueryBuilder('pd')
      .select([
        'pd.id',
        'pd.title',
        'pd.description',
        'pd.sizes',
        'pd.category.id',
        'pd.productImage.fileUrl',
      ])
      .where('pd.deleted = :deleted', { deleted: false })
      .getRawMany();
  }

  async getById(id: number): Promise<Product> {
    return this.productRepository.findOneBy({ id });
  }

  async findById(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { id },
      relations: ['category', 'productImage'], // Liệt kê các quan hệ cần lấy
    });
  }

  async existsByTitle(title: string): Promise<boolean> {
    const count = await this.productRepository
      .createQueryBuilder('pd')
      .where('pd.title = :title', { title })
      .getCount();
    return count > 0;
  }

  async existsByProductNameAndIdNot(
    title: string,
    id: number,
  ): Promise<boolean> {
    const count = await this.productRepository
      .createQueryBuilder('pd')
      .where('pd.title = :title', { title })
      .andWhere('pd.id != :id', { id })
      .getCount();
    return count > 0;
  }

  async createWithImage(
    productCreateDTO: ProductCreateDTO,
    file: Express.Multer.File,
  ): Promise<Product> {
    const category = await this.categoryService.findById(
      Number(productCreateDTO.categoryId),
    );
    if (!category) throw new Error('Category not found');

    const fileType = file.mimetype.substring(0, 5);
    let productImage = new ProductImage();
    productImage.fileType = fileType;

    productImage = await this.productImageService.save(productImage);

    if (fileType === EnumFileType.IMAGE) {
      productImage = await this.uploadAndSaveProductImage(file, productImage);
    }

    const product = productCreateDTO.toProduct(category, productImage);
    return this.productRepository.save(product);
  }

  async createNoImage(productCreateDTO: ProductCreateDTO): Promise<Product> {
    const category = await this.categoryService.findById(
      Number(productCreateDTO.categoryId),
    );
    if (!category) throw new Error('Category not found');

    let productImage = await this.productImageService.findById(
      this.DEFAULT_PRODUCT_IMAGE_ID,
    );
    if (!productImage) throw new Error('Default product image not found');

    productImage = await this.productImageService.save(productImage);

    const product = productCreateDTO.toProduct(category, productImage);
    return this.productRepository.save(product);
  }

  async saveWithImage(
    product: Product,
    file: Express.Multer.File,
  ): Promise<Product> {
    const fileType = file.mimetype.substring(0, 5);
    let productImage = new ProductImage();
    productImage.fileType = fileType;
    productImage = await this.productImageService.save(productImage);

    if (fileType === EnumFileType.IMAGE) {
      productImage = await this.uploadAndSaveProductImage(file, productImage);
    }

    product.productImage = productImage;
    return this.productRepository.save(product);
  }

  private async uploadAndSaveProductImage(
    file: Express.Multer.File,
    productImage: ProductImage,
  ): Promise<ProductImage> {
    try {
      const uploadResult = await this.uploadService.uploadImage(
        file,
        this.cloudinaryUploadUtil.buildImageUploadParams(
          productImage.id,
          this.cloudinaryUploadUtil.PRODUCT_IMAGE_UPLOAD_FOLDER,
          this.cloudinaryUploadUtil.ERROR_IMAGE_UPLOAD,
        ),
      );
      const {
        secure_url: fileUrl,
        format: fileFormat,
        height,
        width,
      } = uploadResult;

      productImage.width = height;
      productImage.height = width;
      productImage.fileName = `${productImage.id}.${fileFormat}`;
      productImage.fileUrl = fileUrl;
      productImage.fileFolder =
        this.cloudinaryUploadUtil.PRODUCT_IMAGE_UPLOAD_FOLDER;
      productImage.cloudId = `${productImage.fileFolder}/${productImage.id}`;

      return this.productImageService.save(productImage);
    } catch (error) {
      console.log('er', error);

      throw new Error('Upload hình ảnh thất bại.');
    }
  }

  async save(product: Product): Promise<Product> {
    return this.productRepository.save(product);
  }

  //   async remove(id: number): Promise<void> {

  //   }

  async softDelete(productId: number): Promise<void> {
    await this.productRepository.update(productId, { deleted: true });
  }
}
