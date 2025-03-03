import { Expose, Transform } from 'class-transformer';
import { CTable } from 'src/models/entities/cTable.entity';
import { EnumTableStatus } from 'src/models/enums/enumTableStatus';

export class TableDTO {
  @Expose()
  id?: number;
  @Expose()
  name: string;
  @Expose()
  @Transform(({ obj }) => {
    // Tìm key tương ứng với giá trị enum
    return Object.keys(EnumTableStatus).find(
      (key) => EnumTableStatus[key] === obj.status,
    );
  })
  status: EnumTableStatus;
  @Expose()
  @Transform(({ obj }) => obj.status)
  statusValue: string;

  constructor(id?: number, name?: string, status?: EnumTableStatus) {
    if (id !== undefined) this.id = id;
    if (name !== undefined) this.name = name;
    if (status !== undefined) {
      this.status = status;
      this.statusValue = EnumTableStatus[status];
    }
  }

  toTable(): CTable {
    const table = new CTable();
    table.id = this.id;
    table.name = this.name;
    table.status = this.status;
    return table;
  }
}
