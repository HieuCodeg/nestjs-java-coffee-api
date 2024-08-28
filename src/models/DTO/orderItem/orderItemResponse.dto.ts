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
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  productPhoto?: string;

  @IsOptional()
  @IsDecimal()
  price?: number;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsInt()
  quantityDelivery?: number;

  @IsOptional()
  @IsDecimal()
  amount?: number;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  tableId?: number;

  @IsOptional()
  @IsNumber()
  productId?: number;

  @IsOptional()
  @IsNumber()
  orderId?: number;

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
