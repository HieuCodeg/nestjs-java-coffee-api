import {
  IsNumber,
  IsString,
  IsOptional,
  IsDecimal,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TableDTO } from '../table/table.dto';
import { StaffDTO } from '../staff/staff.dto';
import { Order } from 'src/models/entities/order.entity';
import { EnumOrderStatus } from 'src/models/enums/enumOrderStatus';
import { CTable } from 'src/models/entities/cTable.entity';
import { Staff } from 'src/models/entities/staff.entity';

export class OrderDTO {
  @IsOptional()
  @IsNumber({}, { message: 'ID phải là số.' })
  id?: number;

  @IsDecimal({}, { message: 'Total amount phải là số thập phân.' })
  totalAmount: number;

  @IsString({ message: 'Order status phải là chuỗi.' })
  orderStatus: string;

  @Type(() => TableDTO)
  table: TableDTO;

  @Type(() => StaffDTO)
  staff: StaffDTO;

  @IsOptional()
  @IsDate({ message: 'Created at phải là ngày.' })
  @Type(() => Date)
  createdAt?: Date;

  constructor(
    id?: number,
    totalAmount?: number,
    orderStatus?: EnumOrderStatus,
    table?: CTable,
    staff?: Staff,
    createdAt?: Date,
  ) {
    this.id = id;
    this.totalAmount = totalAmount;
    this.orderStatus = orderStatus;
    this.table = table.toTableDTO();
    this.staff = staff.toStaffDTO();
    this.createdAt = createdAt;
  }

  toOrder(): Order {
    const order = new Order();
    order.id = this.id;
    order.totalAmount = this.totalAmount;
    order.orderStatus = EnumOrderStatus[this.orderStatus];
    order.table = this.table.toTable();
    order.staff = this.staff.toStaff();
    return order;
  }
}
