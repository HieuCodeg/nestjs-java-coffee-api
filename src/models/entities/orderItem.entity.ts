import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { EnumOrderItemStatus } from '../enums/enumOrderItemStatus';
import { Product } from './product.entity';
import { Order } from './order.entity';
import { OrderItemDTO } from '../DTO/orderItem/orderItem.dto';

@Entity('order_items')
export class OrderItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  size: string;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  quantityDelivery: number;

  @Column({ type: 'int' })
  amount: number;

  @Column({ nullable: true })
  note?: string;

  @Column({ type: 'bigint', nullable: true })
  tableId?: number;

  @Column({ type: 'enum', enum: EnumOrderItemStatus })
  orderItemStatus: EnumOrderItemStatus;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Order, { eager: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  toOrderItemDTO(): OrderItemDTO {
    const dto = new OrderItemDTO(
      this.id,
      this.size,
      this.price,
      this.quantity,
      this.quantityDelivery,
      this.amount,
      this.note,
      this.tableId,
      this.product.toProductDTO(),
      this.order.toOrderDTO(),
      this.orderItemStatus.toString(),
    );
    return dto;
  }
}
