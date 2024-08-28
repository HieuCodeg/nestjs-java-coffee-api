import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('database_check')
export class DatabaseCheck {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'product_check', type: 'int' })
  productCheck: number;

  @Column({ name: 'table_check', type: 'int' })
  tableCheck: number;
}
