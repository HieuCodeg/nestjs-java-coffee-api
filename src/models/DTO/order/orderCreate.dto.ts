import { IsNumberString } from 'class-validator';

export class OrderCreateDTO {
  id?: number;

  @IsNumberString({}, { message: 'Id bàn phải là số.' })
  tableId: number;

  @IsNumberString({}, { message: 'Id nhân viên phải là số.' })
  staffId: number;
}
