import { IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemCreateDTO } from '../orderItem/orderItemCreate.dto';

export class OrderCreateWithOrderItemDTO {
  @IsNumber({}, { message: 'Order ID phải là số.' })
  orderId: number;

  @IsNumber({}, { message: 'Staff ID phải là số.' })
  staffId: number;

  @IsNumber({}, { message: 'Table ID phải là số.' })
  tableId: number;

  @IsArray({ message: 'Order items phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemCreateDTO)
  orderItems: OrderItemCreateDTO[];
}
