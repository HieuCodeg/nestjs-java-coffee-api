import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Patch,
  HttpStatus,
  Res,
  BadRequestException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AppUtils } from 'src/common/app.untils';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { CategoryDTO } from 'src/models/DTO/category/category.dto';
import { CategoryServiceImpl } from 'src/services/category.service';

@UseGuards(JwtAuthGuard)
@Controller('api/categories')
export class CategoryAPIController {
  constructor(
    private readonly appUtils: AppUtils,
    private readonly categoryService: CategoryServiceImpl,
  ) {}

  @Get()
  async findAll(@Res() res: Response) {
    try {
      const categoryDTOList = await this.categoryService.findAllCategoryDTO();
      return res.status(HttpStatus.OK).json(categoryDTOList);
    } catch (error) {
      console.log('err', error);

      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number, @Res() res: Response) {
    const categoryDTOOptional =
      await this.categoryService.findCategoryDTOById(id);

    if (!categoryDTOOptional) {
      throw new NotFoundException('Thể loại không tồn tại!');
    }

    return res.status(HttpStatus.OK).json(categoryDTOOptional);
  }

  @Post('/create')
  async createCategory(@Body() categoryDTO: CategoryDTO, @Res() res: Response) {
    const existsByCategory = await this.categoryService.existsCategoryByTitle(
      categoryDTO.title,
    );
    const categoryDTOPayload = new CategoryDTO();
    categoryDTOPayload.title = categoryDTO.title;

    if (existsByCategory) {
      throw new BadRequestException('Đã tồn tại!');
    }

    const category = await this.categoryService.save(
      categoryDTOPayload.toCategory(),
    );
    return res.status(HttpStatus.OK).json(category.toCategoryDTO());
  }

  @Delete('/delete/:id')
  async deleteCategory(@Param('id') id: number, @Res() res: Response) {
    await this.categoryService.softDelete(id);
    return res.status(HttpStatus.OK).send();
  }

  @Patch('/update/:id')
  async editCategory(
    @Param('id') id: number,
    @Body() categoryDTO: CategoryDTO,
    @Res() res: Response,
  ) {
    const existsByCategory = await this.categoryService.existsCategoryByTitle(
      categoryDTO.title,
    );

    if (existsByCategory) {
      throw new BadRequestException('Loại sản phẩm đã tồn tại!');
    }

    const category = await this.categoryService.findById(id);

    if (!category) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json('Loại sản phẩm không tồn tại!');
    }

    try {
      category.updatedAt = new Date();
      category.title = categoryDTO.title;

      const updatedCategory = await this.categoryService.save(category);
      return res.status(HttpStatus.OK).json(updatedCategory.toCategoryDTO());
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json('Vui lòng liên hệ Administrator');
    }
  }
}
