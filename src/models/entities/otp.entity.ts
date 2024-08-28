import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { BaseEntity } from './baseEntity';
import { OtpDTO } from '../DTO/otp/otp.dto';

@Entity('otps')
export class Otp extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  toOtpDTO(): OtpDTO {
    const otpDTO = new OtpDTO();
    otpDTO.id = this.id;
    otpDTO.code = this.code;
    otpDTO.user = this.user.toUserDTO(); // Ensure that `toUserDTO` is defined in the User entity
    return otpDTO;
  }
}
