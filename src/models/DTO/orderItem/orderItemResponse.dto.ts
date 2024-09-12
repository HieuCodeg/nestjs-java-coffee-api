import { Expose } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsDecimal,
  IsInt,
} from 'class-validator';
import { Order } from 'src/models/entities/order.entity';
import { OrderItem } from 'src/models/entities/orderItem.entity';
import { Product } from 'src/models/entities/product.entity';
import { EnumOrderItemStatus } from 'src/models/enums/enumOrderItemStatus';

export class OrderItemResponseDTO {
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
  @IsString()
  productName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  productPhoto?: string;

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
    this.productName = product.title;
    this.productPhoto = product.productImage.fileUrl;
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

  toOrderItem(product: Product, order: Order): OrderItem {
    return {
      id: this.id,
      size: this.size,
      price: this.price,
      quantity: this.quantity,
      quantityDelivery: this.quantityDelivery,
      amount: this.amount,
      note: this.note,
      tableId: this.tableId,
      orderItemStatus:
        EnumOrderItemStatus[
          this.orderItemStatus as keyof typeof EnumOrderItemStatus
        ],
      product: product,
      order: order,
    } as OrderItem;
  }
}
