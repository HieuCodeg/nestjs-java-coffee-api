import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseEntity } from './baseEntity';
import { EnumTableStatus } from '../enums/enumTableStatus';
import { TableDTO } from '../DTO/table/table.dto';

@Entity('tables')
export class CTable extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: EnumTableStatus })
  status: EnumTableStatus;

  toTableDTO(): TableDTO {
    const tableDTO = new TableDTO();
    tableDTO.id = this.id;
    tableDTO.name = this.name;
    tableDTO.status = this.status;
    tableDTO.statusValue = this.status.toString();
    return tableDTO;
  }
}
