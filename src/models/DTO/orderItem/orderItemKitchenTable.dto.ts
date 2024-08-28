import {
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemKitchenTableDTO {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  orderItemId?: number;

  @IsOptional()
  @IsString()
  tableName?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  productId?: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsInt()
  quantityDelivery?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  createdAt?: Date;

  constructor(
    orderItemId?: number,
    tableName?: string,
    productId?: number,
    productName?: string,
    size?: string,
    quantity?: number,
    quantityDelivery?: number,
    createdAt?: Date,
  ) {
    this.orderItemId = orderItemId;
    this.tableName = tableName;
    this.productId = productId;
    this.productName = productName;
    this.size = size;
    this.quantity = quantity;
    this.quantityDelivery = quantityDelivery;
    this.createdAt = createdAt;
  }
}
