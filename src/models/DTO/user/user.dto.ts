import { IsNotEmpty, IsEmail, Length, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { User } from 'src/models/entities/user.entity';
import { RoleDTO } from '../role/role.dto';

export class UserDTO {
  @Expose()
  id: number;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập email!' })
  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @Length(10, 50, { message: 'Độ dài email nằm trong khoảng 10-50 ký tự!' })
  username: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu!' })
  @Length(10, 20, { message: 'Độ dài mật khẩu nằm trong khoảng 10-20 ký tự!' })
  password: string;

  @Expose()
  isFirstLogin: boolean;

  @Expose()
  codeFirstLogin: string;

  @Expose()
  @ValidateNested()
  @Type(() => RoleDTO)
  role: RoleDTO;

  toUser(): User {
    const user = new User();
    user.id = this.id;
    user.username = this.username;
    user.password = this.password;
    user.isFirstLogin = this.isFirstLogin;
    user.codeFirstLogin = this.codeFirstLogin;
    if (this.role) {
      user.role = this.role.toRole();
    }
    return user;
  }
}
