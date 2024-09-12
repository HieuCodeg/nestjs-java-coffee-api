import {
  IsNumber,
  IsString,
  IsDecimal,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Product } from 'src/models/entities/product.entity';
import { OrderItemResponseDTO } from './orderItemResponse.dto';
import { Order } from 'src/models/entities/order.entity';
import { EnumOrderItemStatus } from 'src/models/enums/enumOrderItemStatus';
import { Expose } from 'class-transformer';

export class OrderItemCreateDTO {
  @Expose()
  @IsOptional()
  @IsNumber()
  id?: number;

  @Expose()
  @IsOptional()
  @IsString()
  size?: string;

  @Expose()
  @IsOptional()
  @IsDecimal()
  price?: number;

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
  @IsDecimal()
  amount?: number;

  @Expose()
  @IsOptional()
  @IsString()
  note?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  tableId?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  productId?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  orderId?: number;

  @Expose()
  @IsOptional()
  @IsString()
  orderItemStatus?: string;

  constructor(
    id: number,
    size: string,
    price: number,
    quantity: number,
    quantityDelivery: number,
    amount: number,
    note: string,
    tableId: number,
    product: Product,
    order: Order,
    orderItemStatus: EnumOrderItemStatus,
  ) {
    this.id = id;
    this.size = size;
    this.price = price;
    this.quantity = quantity;
    this.quantityDelivery = quantityDelivery;
    this.amount = amount;
    this.note = note;
    this.tableId = tableId;
    this.productId = product.id;
    this.orderId = order.id;
    this.orderItemStatus = EnumOrderItemStatus[orderItemStatus];
  }

  toOrderItemResponseDTO(product: Product): OrderItemResponseDTO {
    return {
      id: this.id,
      productName: product.title,
      productPhoto: product.productImage.fileUrl,
      size: this.size,
      price: this.price,
      quantity: this.quantity,
      quantityDelivery: this.quantityDelivery,
      amount: this.amount,
      note: this.note,
      tableId: this.tableId,
      productId: this.productId,
      orderId: this.orderId,
      orderItemStatus: this.orderItemStatus,
    } as OrderItemResponseDTO;
  }
}
