import { Expose } from 'class-transformer';
import { IsNumberString } from 'class-validator';

export class OrderCreateDTO {
  @Expose()
  id?: number;

  @Expose()
  @IsNumberString({}, { message: 'Id bàn phải là số.' })
  tableId: number;

  @Expose()
  @IsNumberString({}, { message: 'Id nhân viên phải là số.' })
  staffId: number;
}
