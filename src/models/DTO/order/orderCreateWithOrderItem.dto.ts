import { IsNumber, ValidateNested, IsArray } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OrderItemCreateDTO } from '../orderItem/orderItemCreate.dto';

export class OrderCreateWithOrderItemDTO {
  @Expose()
  @IsNumber({}, { message: 'Order ID phải là số.' })
  orderId: number;

  @Expose()
  @IsNumber({}, { message: 'Staff ID phải là số.' })
  staffId: number;

  @Expose()
  @IsNumber({}, { message: 'Table ID phải là số.' })
  tableId: number;

  @Expose()
  @IsArray({ message: 'Order items phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemCreateDTO)
  orderItems: OrderItemCreateDTO[];
}
