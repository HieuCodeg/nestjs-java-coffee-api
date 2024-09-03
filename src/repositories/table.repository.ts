import { Injectable } from '@nestjs/common';
import { TableDTO } from 'src/models/DTO/table/table.dto';
import { CTable } from 'src/models/entities/cTable.entity';
import { EnumTableStatus } from 'src/models/enums/enumTableStatus';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class TableRepository extends Repository<CTable> {
  async getAllTableWhereDeletedIsFalse(): Promise<TableDTO[]> {
    return this.createQueryBuilder('tb')
      .select(['tb.id', 'tb.name', 'tb.status'])
      .where('tb.deleted = :deleted', { deleted: false })
      .getRawMany(); // Sử dụng getRawMany để lấy kết quả dạng DTO
  }

  async getTablesWhereStatus(status: EnumTableStatus): Promise<TableDTO[]> {
    return this.createQueryBuilder('tb')
      .select(['tb.id', 'tb.name', 'tb.status'])
      .where('tb.deleted = :deleted', { deleted: false })
      .andWhere('tb.status = :status', { status })
      .getRawMany(); // Sử dụng getRawMany để lấy kết quả dạng DTO
  }

  async existsByName(name: string): Promise<boolean> {
    const count = await this.createQueryBuilder('tb')
      .where('tb.name = :name', { name })
      .getCount();
    return count > 0;
  }

  async existsByNameAndIdIsNot(name: string, id: number): Promise<boolean> {
    const count = await this.createQueryBuilder('tb')
      .where('tb.name = :name', { name })
      .andWhere('tb.id <> :id', { id })
      .getCount();
    return count > 0;
  }

  async softDelete(tableId: number): Promise<UpdateResult> {
    return await this.createQueryBuilder()
      .update(CTable)
      .set({ deleted: true })
      .where('id = :tableId', { tableId })
      .execute();
  }
}
