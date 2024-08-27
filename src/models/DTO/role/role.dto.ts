import { IsNotEmpty, IsNumber } from 'class-validator';
import { Role } from 'src/models/entities/role.entity';

export class RoleDTO {
  @IsNotEmpty({ message: 'Bạn chưa chọn quyền!' })
  @IsNumber()
  id: number;

  code: string;

  constructor(id?: number, code?: string) {
    this.id = id;
    this.code = code;
  }

  toRole(): Role {
    const role = new Role();
    role.id = this.id;
    role.code = this.code;
    return role;
  }
}
