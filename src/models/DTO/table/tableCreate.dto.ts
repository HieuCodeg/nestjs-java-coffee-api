import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { CTable } from 'src/models/entities/cTable.entity';
import { EnumTableStatus } from 'src/models/enums/enumTableStatus';

export class TableCreateDTO {
  @Expose()
  id: number;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập tên bàn.' })
  @IsString()
  @Length(4, 20, {
    message: 'Tên bàn có độ dài nằm trong khoảng 4 - 20 ký tự.',
  })
  name: string;

  toTable(): CTable {
    const table = new CTable();
    table.id = this.id;
    table.name = this.name;
    table.status = EnumTableStatus.EMPTY; // Gán giá trị enum cố định
    return table;
  }
}
