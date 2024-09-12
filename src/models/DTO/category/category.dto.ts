import { Expose } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { Category } from 'src/models/entities/category.entity';

export class CategoryDTO {
  @Expose()
  id?: number;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập tên loại sản phẩm!' })
  @Length(3, 30, {
    message: 'Loại sản phẩm có độ dài nằm trong khoảng 3 - 30 ký tự.',
  })
  title: string;

  toCategory(): Category {
    const category = new Category();
    category.id = this.id;
    category.title = this.title;
    return category;
  }
}
