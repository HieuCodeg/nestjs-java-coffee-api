import {
  IsNumber,
  IsString,
  IsDecimal,
  IsInt,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OrderDTO } from '../order/order.dto';
import { OrderItem } from 'src/models/entities/orderItem.entity';
import { ProductDTO } from '../product/product.dto';
import { EnumOrderItemStatus } from 'src/models/enums/enumOrderItemStatus';

export class OrderItemDTO {
  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'ID phải là số.' })
  id?: number;

  @Expose()
  @IsString({ message: 'Size phải là chuỗi.' })
  size: string;

  @Expose()
  @IsDecimal({}, { message: 'Price phải là số thập phân.' })
  price: number;

  @Expose()
  @IsInt({ message: 'Quantity phải là số nguyên.' })
  quantity: number;

  @Expose()
  @IsInt({ message: 'Quantity delivery phải là số nguyên.' })
  quantityDelivery: number;

  @Expose()
  @IsDecimal({}, { message: 'Amount phải là số thập phân.' })
  amount: number;

  @Expose()
  @IsOptional()
  @IsString({ message: 'Note phải là chuỗi.' })
  note?: string;

  @Expose()
  @IsNumber({}, { message: 'Table ID phải là số.' })
  tableId: number;

  @Expose()
  @Type(() => ProductDTO)
  product: ProductDTO;

  @Expose()
  @Type(() => OrderDTO)
  order: OrderDTO;

  @Expose()
  @IsString({ message: 'Order item status phải là chuỗi.' })
  orderItemStatus: string;

  @Expose()
  @IsOptional()
  @IsDate({ message: 'CreatedAt phải là ngày tháng.' })
  createdAt?: Date;

  constructor(
    id: number,
    size: string,
    price: number,
    quantity: number,
    quantityDelivery: number,
    amount: number,
    note: string,
    tableId: number,
    product: ProductDTO,
    order: OrderDTO,
    orderItemStatus: string,
    createdAt?: Date,
  ) {
    this.id = id;
    this.size = size;
    this.price = price;
    this.quantity = quantity;
    this.quantityDelivery = quantityDelivery;
    this.amount = amount;
    this.note = note;
    this.tableId = tableId;
    this.product = product;
    this.order = order;
    this.orderItemStatus = orderItemStatus;
    this.createdAt = createdAt;
  }

  toOrderItem(): OrderItem {
    const orderItem = new OrderItem();
    orderItem.id = this.id;
    orderItem.size = this.size;
    orderItem.price = this.price;
    orderItem.quantity = this.quantity;
    orderItem.quantityDelivery = this.quantityDelivery;
    orderItem.amount = this.amount;
    orderItem.note = this.note;
    orderItem.tableId = this.tableId;
    orderItem.product = this.product.toProduct();
    orderItem.order = this.order.toOrder();
    orderItem.orderItemStatus =
      EnumOrderItemStatus[
        this.orderItemStatus as keyof typeof EnumOrderItemStatus
      ];
    orderItem.createdAt = this.createdAt;
    return orderItem;
  }
}
