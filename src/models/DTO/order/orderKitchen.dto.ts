import {
  IsNumber,
  IsString,
  IsOptional,
  IsInt,
  IsArray,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderItemKitchenTableDTO } from '../orderItem/orderItemKitchenTable.dto';

export class OrderKitchenDTO {
  @IsNumber({}, { message: 'Table ID phải là số.' })
  tableId: number;

  @IsString({ message: 'Table name phải là chuỗi.' })
  tableName: string;

  @IsOptional()
  @IsDate({ message: 'Time wait phải là ngày.' })
  @Type(() => Date)
  timeWait?: Date;

  @IsInt({ message: 'Count product phải là số nguyên.' })
  countProduct: number;

  @IsOptional()
  @IsNumber({}, { message: 'Order ID phải là số.' })
  orderId?: number;

  @IsArray({ message: 'Order items phải là một mảng.' })
  @Type(() => OrderItemKitchenTableDTO)
  orderItems: OrderItemKitchenTableDTO[];
}
