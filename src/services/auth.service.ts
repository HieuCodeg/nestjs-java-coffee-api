import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserLoginDTO } from 'src/models/DTO/user/userLogin.dto';
import { UserForgetPasswordDTO } from 'src/models/DTO/user/userForgetPassword.dto';
import { OtpServiceImpl } from './otp.service';
import { StaffServiceImpl } from './staff.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpServiceImpl,
    private readonly staffService: StaffServiceImpl,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.getByUsername(username);

    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(userLoginDTO: UserLoginDTO) {
    const user = await this.validateUser(
      userLoginDTO.username,
      userLoginDTO.password,
    );

    if (!user || user.isFirstLogin) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    if (user.delete) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa!');
    }

    const payload = { username: user.username, sub: user.id };
    const staff = await this.staffService.getByUsernameDTO(user.username);

    return {
      token: this.jwtService.sign(payload),
      userId: user.id,
      username: user.username,
      role: user.role,
      name: staff.fullName,
    };
  }

  async resetPassword(userForgetPasswordDTO: UserForgetPasswordDTO) {
    const { username, password, passwordConfirm, otp } = userForgetPasswordDTO;
    const user = await this.userService.getByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Email không hợp lệ!');
    }

    if (user.deleted) {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa!');
    }

    if (password !== passwordConfirm) {
      throw new UnauthorizedException('Mật khẩu không khớp nhau!');
    }

    const otpValid = await this.otpService.getByCode(otp);

    if (!otpValid) {
      throw new UnauthorizedException('OTP không hợp lệ');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await this.userService.save(user);

    return { message: 'Password reset successfully' };
  }
}
