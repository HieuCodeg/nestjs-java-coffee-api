import {
  IsNumber,
  IsString,
  IsDecimal,
  IsDate,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemResponseDTO } from '../orderItem/orderItemResponse.dto';

export class OrderPayDTO {
  @IsNumber({}, { message: 'Order ID phải là số.' })
  orderId: number;

  @IsString({ message: 'Staff name phải là chuỗi.' })
  staffName: string;

  @IsString({ message: 'Table name phải là chuỗi.' })
  tableName: string;

  @IsDecimal({}, { message: 'Total amount phải là số thập phân.' })
  totalAmount: number;

  @IsOptional()
  @IsDate({ message: 'Created at phải là ngày.' })
  @Type(() => Date)
  creatAt?: Date;

  @IsArray({ message: 'Order items phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemResponseDTO)
  orderItems: OrderItemResponseDTO[];
}
