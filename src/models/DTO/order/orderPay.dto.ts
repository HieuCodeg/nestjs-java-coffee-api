import {
  IsNumber,
  IsString,
  IsDecimal,
  IsDate,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OrderItemResponseDTO } from '../orderItem/orderItemResponse.dto';

export class OrderPayDTO {
  @Expose()
  @IsNumber({}, { message: 'Order ID phải là số.' })
  orderId: number;

  @Expose()
  @IsString({ message: 'Staff name phải là chuỗi.' })
  staffName: string;

  @Expose()
  @IsString({ message: 'Table name phải là chuỗi.' })
  tableName: string;

  @Expose()
  @IsDecimal({}, { message: 'Total amount phải là số thập phân.' })
  totalAmount: number;

  @Expose()
  @IsOptional()
  @IsDate({ message: 'Created at phải là ngày.' })
  @Type(() => Date)
  creatAt?: Date;

  @Expose()
  @IsArray({ message: 'Order items phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemResponseDTO)
  orderItems: OrderItemResponseDTO[];
}
