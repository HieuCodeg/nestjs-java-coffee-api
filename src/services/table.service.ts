import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TableDTO } from 'src/models/DTO/table/table.dto';
import { CTable } from 'src/models/entities/cTable.entity';
import { EnumTableStatus } from 'src/models/enums/enumTableStatus';
import { TableRepository } from 'src/repositories/table.repository';

@Injectable()
export class TableService {
  constructor(
    @InjectRepository(CTable)
    private readonly tableRepository: TableRepository,
  ) {}

  async findAll(): Promise<CTable[]> {
    return this.tableRepository.find();
  }

  async getAllTableWhereDeletedIsFalse(): Promise<TableDTO[]> {
    return this.tableRepository.getAllTableWhereDeletedIsFalse();
  }

  async getTablesWhereStatus(status: EnumTableStatus): Promise<TableDTO[]> {
    return this.tableRepository.getTablesWhereStatus(status);
  }

  async getById(id: number): Promise<CTable | undefined> {
    return this.tableRepository.findOneBy({ id });
  }

  async findById(id: number): Promise<CTable | undefined> {
    return this.tableRepository.findOneBy({ id });
  }

  async existByName(name: string): Promise<boolean> {
    return await this.tableRepository.existsByName(name);
  }

  async existByNameAndIdIsNot(name: string, id: number): Promise<boolean> {
    return await this.tableRepository.existsByNameAndIdIsNot(name, id);
  }

  async save(cTable: CTable): Promise<CTable> {
    return this.tableRepository.save(cTable);
  }

  //   async remove(id: number): Promise<void> {
  //     // Implement logic if needed
  //   }

  async softDelete(tableId: number): Promise<void> {
    await this.tableRepository.softDelete(tableId);
  }
}
