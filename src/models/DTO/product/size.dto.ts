import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  Length,
  IsNumberString,
  ValidateIf,
} from 'class-validator';

export class SizeDTO {
  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập tên size.' })
  @Length(1, 5, { message: 'Tên size có độ dài nằm trong khoảng 1-5 ký tự.' })
  name: string;

  @Expose()
  @IsNotEmpty({ message: 'Giá sản phẩm không được để trống.' })
  @IsNumberString({}, { message: 'Giá sản phẩm phải là số.' })
  @ValidateIf((o) => o.price.length > 0)
  price: string;

  constructor(name: string, price: string) {
    (this.name = name), (this.price = price);
  }

  validate(): string[] {
    const errors: string[] = [];
    if (this.price) {
      if (this.price.length > 9) {
        errors.push('Giá sản phẩm tối đa là 999.999.999 VNĐ');
      }
      if (this.price.length < 6) {
        errors.push('Giá sản phẩm thấp nhất là 100.000 VNĐ');
      }
      if (!/^(\d+)?$/.test(this.price)) {
        errors.push('Giá sản phẩm phải là số.');
      }
    } else {
      errors.push('Vui lòng nhập giá sản phẩm.');
    }
    return errors;
  }
}
