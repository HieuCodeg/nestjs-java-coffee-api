import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CategoryDTO } from '../DTO/category/category.dto';
import { BaseEntity } from './baseEntity';

@Entity('categories')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  title: string;

  toCategoryDTO(): CategoryDTO {
    return new CategoryDTO({
      id: this.id,
      title: this.title,
    });
  }
}
