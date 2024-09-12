import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseCheck } from 'src/models/entities/databaseCheck.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseCheckServiceImpl {
  private static readonly DATABASE_CHECK_ID: number = 0;

  constructor(
    @InjectRepository(DatabaseCheck)
    private readonly databaseCheckRepository: Repository<DatabaseCheck>,
  ) {}

  findAll(): Promise<DatabaseCheck[]> {
    return null;
  }

  async getById(id: number): Promise<DatabaseCheck> {
    return this.databaseCheckRepository.findOne({ where: { id } });
  }

  async getDatabaseCheck(): Promise<DatabaseCheck> {
    let databaseCheck = await this.databaseCheckRepository.findOne({
      where: { id: DatabaseCheckServiceImpl.DATABASE_CHECK_ID },
    });
    if (!databaseCheck) {
      await this.create({ id: 0, productCheck: 0, tableCheck: 0 });
      databaseCheck = await this.databaseCheckRepository.findOne({
        where: { id: DatabaseCheckServiceImpl.DATABASE_CHECK_ID },
      });
    }
    return databaseCheck;
  }

  //   findById(id: number): Promise<DatabaseCheck | null> {
  //     return null;
  //   }

  async create(data: Partial<DatabaseCheck>): Promise<DatabaseCheck> {
    const newCheck = this.databaseCheckRepository.create(data);
    return this.databaseCheckRepository.save(newCheck);
  }

  async updateWithTableCheck(): Promise<DatabaseCheck> {
    const databaseCheck = await this.getDatabaseCheck();
    const tableCheck = databaseCheck.tableCheck + 1;
    databaseCheck.tableCheck = tableCheck;
    return this.databaseCheckRepository.save(databaseCheck);
  }

  async updateWithProductCheck(): Promise<DatabaseCheck> {
    const databaseCheck = await this.getDatabaseCheck();
    console.log(databaseCheck, 'check');
    const productCheck = databaseCheck.productCheck + 1;
    databaseCheck.productCheck = productCheck;
    return this.databaseCheckRepository.save(databaseCheck);
  }

  //   remove(id: number): void {
  //     // Implementation goes here
  //   }
}
