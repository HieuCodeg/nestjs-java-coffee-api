import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TableDTO } from 'src/models/DTO/table/table.dto';
import { CTable } from 'src/models/entities/cTable.entity';
import { EnumTableStatus } from 'src/models/enums/enumTableStatus';
import { Repository } from 'typeorm';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(CTable)
    private readonly tableRepository: Repository<CTable>,
  ) {}

  async findAll(): Promise<CTable[]> {
    return this.tableRepository.find();
  }

  async getAllTableWhereDeletedIsFalse(): Promise<TableDTO[]> {
    return this.tableRepository
      .createQueryBuilder('tb')
      .select(['tb.id', 'tb.name', 'tb.status'])
      .where('tb.deleted = :deleted', { deleted: false })
      .getRawMany();
  }

  async getTablesWhereStatus(status: EnumTableStatus): Promise<TableDTO[]> {
    return this.tableRepository
      .createQueryBuilder('tb')
      .select(['tb.id', 'tb.name', 'tb.status'])
      .where('tb.deleted = :deleted', { deleted: false })
      .andWhere('tb.status = :status', { status })
      .getRawMany();
  }

  async getById(id: number): Promise<CTable | undefined> {
    return this.tableRepository.findOneBy({ id });
  }

  async findById(id: number): Promise<CTable | undefined> {
    return this.tableRepository.findOneBy({ id });
  }

  async existByName(name: string): Promise<boolean> {
    const count = await this.tableRepository
      .createQueryBuilder('tb')
      .where('tb.name = :name', { name })
      .getCount();
    return count > 0;
  }

  async existByNameAndIdIsNot(name: string, id: number): Promise<boolean> {
    const count = await this.tableRepository
      .createQueryBuilder('tb')
      .where('tb.name = :name', { name })
      .andWhere('tb.id <> :id', { id })
      .getCount();
    return count > 0;
  }

  async save(cTable: CTable): Promise<CTable> {
    return this.tableRepository.save(cTable);
  }

  //   async remove(id: number): Promise<void> {
  //     // Implement logic if needed
  //   }

  async softDelete(tableId: number): Promise<void> {
    await this.tableRepository
      .createQueryBuilder()
      .update(CTable)
      .set({ deleted: true })
      .where('id = :tableId', { tableId })
      .execute();
  }
}
