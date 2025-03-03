// otp.dto.ts
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Otp } from 'src/models/entities/otp.entity';
import { UserDTO } from '../user/user.dto';
import { Expose } from 'class-transformer';

export class OtpDTO {
  @Expose()
  @IsOptional()
  id?: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  code: string;

  @Expose()
  @IsOptional()
  user?: UserDTO;

  constructor(id?: number, code?: string, user?: UserDTO) {
    this.id = id;
    this.code = code;
    this.user = user;
  }

  toOtp(): Otp {
    const otp = new Otp();
    otp.id = this.id;
    otp.code = this.code;
    otp.user = this.user ? this.user.toUser() : undefined;
    return otp;
  }
}
