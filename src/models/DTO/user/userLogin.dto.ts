import { Expose } from 'class-transformer';
import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';
import { User } from 'src/models/entities/user.entity';

export class UserLoginDTO {
  @Expose()
  @IsOptional()
  id?: number;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập email.' })
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  username: string;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  @IsString()
  password?: string;

  constructor(id?: number, username?: string) {
    this.id = id;
    this.username = username;
  }

  toUser(): User {
    const user = new User();
    user.id = this.id;
    user.username = this.username;
    user.password = this.password;
    return user;
  }
}
