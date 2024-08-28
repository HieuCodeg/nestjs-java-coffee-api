import { CTable } from 'src/models/entities/cTable.entity';
import { EnumTableStatus } from 'src/models/enums/enumTableStatus';

export class TableDTO {
  id?: number;
  name: string;
  status: EnumTableStatus;
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
