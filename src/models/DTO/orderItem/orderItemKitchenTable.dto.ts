import {
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class OrderItemKitchenTableDTO {
  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  orderItemId?: number;

  @Expose()
  @IsOptional()
  @IsString()
  tableName?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  productId?: number;

  @Expose()
  @IsOptional()
  @IsString()
  productName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  size?: string;

  @Expose()
  @IsOptional()
  @IsInt()
  quantity?: number;

  @Expose()
  @IsOptional()
  @IsInt()
  quantityDelivery?: number;

  @Expose()
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
