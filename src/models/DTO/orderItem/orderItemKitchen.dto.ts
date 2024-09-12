import {
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class OrderItemKitchenDTO {
  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  orderItemId?: number;

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
  tableName?: string;

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

  @Expose()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  orderId?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  tableId?: number;

  private constructor(
    orderItemId?: number,
    productId?: number,
    productName?: string,
    tableName?: string,
    size?: string,
    quantity?: number,
    quantityDelivery?: number,
    createdAt?: Date,
    updatedAt?: Date,
    orderId?: number,
    tableId?: number,
  ) {
    this.orderItemId = orderItemId;
    this.productId = productId;
    this.productName = productName;
    this.tableName = tableName;
    this.size = size;
    this.quantity = quantity;
    this.quantityDelivery = quantityDelivery;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.orderId = orderId;
    this.tableId = tableId;
  }

  static fromProductInfo(
    productId: number,
    productName: string,
    size: string,
    quantity: number,
    quantityDelivery: number,
  ): OrderItemKitchenDTO {
    return new OrderItemKitchenDTO(
      undefined,
      productId,
      productName,
      undefined,
      size,
      quantity,
      quantityDelivery,
    );
  }

  static fromOrderInfo(
    orderItemId: number,
    productId: number,
    productName: string,
    tableName: string,
    size: string,
    quantity: number,
    quantityDelivery: number,
    createdAt: Date,
    updatedAt: Date,
  ): OrderItemKitchenDTO {
    return new OrderItemKitchenDTO(
      orderItemId,
      productId,
      productName,
      tableName,
      size,
      quantity,
      quantityDelivery,
      createdAt,
      updatedAt,
    );
  }

  static fromFullInfo(
    orderItemId: number,
    productId: number,
    productName: string,
    tableName: string,
    size: string,
    quantity: number,
    quantityDelivery: number,
    createdAt: Date,
    updatedAt: Date,
    orderId: number,
    tableId: number,
  ): OrderItemKitchenDTO {
    return new OrderItemKitchenDTO(
      orderItemId,
      productId,
      productName,
      tableName,
      size,
      quantity,
      quantityDelivery,
      createdAt,
      updatedAt,
      orderId,
      tableId,
    );
  }
}
