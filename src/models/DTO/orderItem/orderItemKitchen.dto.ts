import {
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemKitchenDTO {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  orderItemId?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  productId?: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  tableName?: string;

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

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  updatedAt?: Date;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  orderId?: number;

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
