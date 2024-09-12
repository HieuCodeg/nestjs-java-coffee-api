import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDTO } from 'src/models/DTO/category/category.dto';
import { Category } from 'src/models/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryServiceImpl {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({ where: { deleted: false } });
  }

  async getById(id: number): Promise<Category> {
    return this.categoryRepository.findOneOrFail({
      where: { id, deleted: false },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepository.findOne({ where: { id, deleted: false } });
  }

  async save(category: Category): Promise<Category> {
    return this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<void> {
    await this.softDelete(id);
  }

  async softDelete(categoryId: number): Promise<void> {
    await this.categoryRepository.update(categoryId, { deleted: true });
  }

  async findAllCategoryDTO(): Promise<CategoryDTO[]> {
    return this.categoryRepository
      .createQueryBuilder('category')
      .select(['category.id AS id', 'category.title AS title'])
      .where('category.deleted = :deleted', { deleted: false })
      .getRawMany(); // Hoặc getMany() nếu bạn đã ánh xạ DTO
  }

  async findCategoryDTOById(id: number): Promise<CategoryDTO | null> {
    const category = await this.categoryRepository
      .createQueryBuilder('category')
      .select(['id', 'title']) // Thay đổi trường theo DTO
      .where('category.id = :id', { id })
      .andWhere('category.deleted = :deleted', { deleted: false })
      .getRawOne(); // Hoặc getOne() nếu bạn đã ánh xạ DTO
    return category || null;
  }

  async existsCategoryByTitle(title: string): Promise<boolean> {
    const count = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.title = :title', { title })
      .andWhere('category.deleted = :deleted', { deleted: false })
      .getCount();
    return count > 0;
  }
}
