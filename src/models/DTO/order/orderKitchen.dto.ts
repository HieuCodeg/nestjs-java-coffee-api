import {
  IsNumber,
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  IsDate,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OrderItemKitchenTableDTO } from '../orderItem/orderItemKitchenTable.dto';

export class OrderKitchenDTO {
  @Expose()
  @IsNumber({}, { message: 'Table ID phải là số.' })
  tableId: number;

  @Expose()
  @IsString({ message: 'Table name phải là chuỗi.' })
  tableName: string;

  @Expose()
  @IsOptional()
  @IsDate({ message: 'Time wait phải là ngày.' })
  @Type(() => Date)
  timeWait?: Date;

  @Expose()
  @IsInt({ message: 'Count product phải là số nguyên.' })
  countProduct: number;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Order ID phải là số.' })
  orderId?: number;

  @Expose()
  @IsArray({ message: 'Order items phải là một mảng.' })
  @Type(() => OrderItemKitchenTableDTO)
  orderItems: OrderItemKitchenTableDTO[];
}
