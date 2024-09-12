import { IsNumber, IsDecimal, IsArray, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OrderItemResponseDTO } from '../orderItem/orderItemResponse.dto';

export class OrderResponseDTO {
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
  @IsDecimal({}, { message: 'Total amount phải là số thập phân.' })
  totalAmount: number;

  @Expose()
  @IsArray({ message: 'Order items phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemResponseDTO)
  orderItems: OrderItemResponseDTO[];
}
