import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { RoleDTO } from '../DTO/role/role.dto';
import { EnumRole } from '../enums/enum.role';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column({ type: 'enum', enum: EnumRole })
  name: EnumRole;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  toRoleDTO(): RoleDTO {
    const roleDTO = new RoleDTO();
    roleDTO.id = this.id;
    roleDTO.code = this.code;
    return roleDTO;
  }
}
