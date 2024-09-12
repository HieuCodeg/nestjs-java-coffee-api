import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ValidationPipe,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { AppUtils } from 'src/common/app.untils';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { ProductCreateDTO } from 'src/models/DTO/product/productCreate.dto';
import { ProductUpdateDTO } from 'src/models/DTO/product/productUpdate.dto';
import { CategoryServiceImpl } from 'src/services/category.service';
import { DatabaseCheckServiceImpl } from 'src/services/database-check.service';
import { ProductService } from 'src/services/product.service';

@UseGuards(JwtAuthGuard)
@Controller('api/products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryServiceImpl,
    private readonly databaseCheckService: DatabaseCheckServiceImpl,
    private readonly appUtils: AppUtils,
  ) {}

  @Get()
  async getAllByDeletedIsFalse() {
    const productDTOS =
      await this.productService.getAllProductDTOWhereDeletedIsFalse();

    if (productDTOS.length === 0) {
      throw new HttpException('No Content', HttpStatus.NO_CONTENT);
    }

    return productDTOS;
  }

  @Get(':productId')
  async getById(@Param('productId') productId: string) {
    const pid = parseInt(productId, 10);

    if (isNaN(pid)) {
      throw new HttpException('Invalid product ID', HttpStatus.BAD_REQUEST);
    }

    const product = await this.productService.findById(pid);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    return product.toProductDTO();
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) productCreateDTO: ProductCreateDTO,
  ) {
    if (
      !productCreateDTO.sizes ||
      productCreateDTO.sizes === '' ||
      productCreateDTO.sizes === '{}'
    ) {
      throw new HttpException('Sizes cannot be empty', HttpStatus.BAD_REQUEST);
    }

    const transformedProductCreateDTO = plainToClass(
      ProductCreateDTO,
      productCreateDTO,
    );

    // Perform size validation here

    const categoryId = parseInt(productCreateDTO.categoryId, 10);
    const category = await this.categoryService.findById(categoryId);

    if (!category) {
      throw new HttpException('Invalid category ID', HttpStatus.BAD_REQUEST);
    }

    if (await this.productService.existsByTitle(productCreateDTO.title)) {
      throw new HttpException('Product already exists', HttpStatus.BAD_REQUEST);
    }

    if (productCreateDTO.summary.trim() === '') {
      transformedProductCreateDTO.summary = productCreateDTO.description;
    }

    let newProduct;
    if (file) {
      newProduct = await this.productService.createWithImage(
        transformedProductCreateDTO,
        file,
      );
    } else {
      newProduct = await this.productService.createNoImage(
        transformedProductCreateDTO,
      );
    }

    await this.databaseCheckService.updateWithProductCheck();

    return newProduct.toProductDTO();
  }

  @Patch(':productId')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('productId') productId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe()) productUpdateDTO: ProductUpdateDTO,
  ) {
    const product = await this.productService.findById(productId);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const categoryId = parseInt(productUpdateDTO.categoryId, 10);
    const category = await this.categoryService.findById(categoryId);

    if (!category) {
      throw new HttpException('Invalid category ID', HttpStatus.BAD_REQUEST);
    }

    if (
      await this.productService.existsByProductNameAndIdNot(
        productUpdateDTO.title,
        productId,
      )
    ) {
      throw new HttpException('Product already exists', HttpStatus.BAD_REQUEST);
    }

    // Perform size validation here

    if (productUpdateDTO.summary.trim() === '') {
      productUpdateDTO.summary = productUpdateDTO.description;
    }

    product.title = productUpdateDTO.title;
    product.category = category;
    product.sizes = productUpdateDTO.sizes;
    product.description = productUpdateDTO.description;
    product.summary = productUpdateDTO.summary;

    const updatedProduct = await this.productService.save(product);

    if (file) {
      await this.productService.saveWithImage(updatedProduct, file);
    }

    await this.databaseCheckService.updateWithProductCheck();

    return updatedProduct.toProductDTO();
  }

  @Delete('delete/:productId')
  async delete(@Param('productId') productId: number) {
    const product = await this.productService.findById(productId);

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    try {
      await this.productService.softDelete(productId);
      await this.databaseCheckService.updateWithProductCheck();
      return { statusCode: HttpStatus.ACCEPTED };
    } catch (error) {
      throw new HttpException(
        'Please contact Administrator',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
