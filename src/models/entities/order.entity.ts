import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { OrderDTO } from '../DTO/order/order.dto';
import { BaseEntity } from './baseEntity';
import { EnumOrderStatus } from '../enums/enumOrderStatus';
import { CTable } from './cTable.entity';
import { Staff } from './staff.entity';

@Entity('orders')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 0 })
  totalAmount: number;

  @Column({ name: 'status_order', length: 50 })
  orderStatus: EnumOrderStatus;

  @OneToOne(() => CTable, { nullable: false })
  @JoinColumn({ name: 'table_id' })
  table: CTable;

  @OneToOne(() => Staff, { nullable: false })
  @JoinColumn({ name: 'staff_id' })
  staff: Staff;

  toOrderDTO(): OrderDTO {
    const orderDTO = new OrderDTO();
    orderDTO.id = this.id;
    orderDTO.totalAmount = this.totalAmount;
    orderDTO.orderStatus = this.orderStatus.toString();
    orderDTO.table = this.table.toTableDTO();
    orderDTO.staff = this.staff.toStaffDTO();
    orderDTO.createdAt = this.createdAt;
    return orderDTO;
  }
}
