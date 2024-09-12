import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Role } from 'src/models/entities/role.entity';

export class RoleDTO {
  @Expose()
  @IsNotEmpty({ message: 'Bạn chưa chọn quyền!' })
  @IsNumber()
  id: number;

  @Expose()
  code: string;

  toRole(): Role {
    const role = new Role();
    role.id = this.id;
    role.code = this.code;
    return role;
  }
}
