import { IsNumber, IsDecimal, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemResponseDTO } from '../orderItem/orderItemResponse.dto';

export class OrderResponseDTO {
  @IsNumber({}, { message: 'Order ID phải là số.' })
  orderId: number;

  @IsNumber({}, { message: 'Staff ID phải là số.' })
  staffId: number;

  @IsNumber({}, { message: 'Table ID phải là số.' })
  tableId: number;

  @IsDecimal({}, { message: 'Total amount phải là số thập phân.' })
  totalAmount: number;

  @IsArray({ message: 'Order items phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemResponseDTO)
  orderItems: OrderItemResponseDTO[];
}
