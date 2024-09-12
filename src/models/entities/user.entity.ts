import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { Role } from './role.entity';
import { UserDTO } from '../DTO/user/user.dto';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ name: 'is_first_login', nullable: false })
  isFirstLogin: boolean;

  @Column({ name: 'code_first_login', nullable: true })
  codeFirstLogin: string;

  @ManyToOne(() => Role, (role) => role.users, { nullable: false })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  toUserDTO(): UserDTO {
    const userDTO = new UserDTO();
    userDTO.id = this.id;
    userDTO.username = this.username;
    userDTO.codeFirstLogin = this.codeFirstLogin;
    userDTO.isFirstLogin = this.isFirstLogin;
    userDTO.role = this.role ? this.role.toRoleDTO() : null;
    return userDTO;
  }
}
