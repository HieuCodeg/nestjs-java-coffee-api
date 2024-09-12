import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserForgetPasswordDTO } from 'src/models/DTO/user/userForgetPassword.dto';
import { UserLoginDTO } from 'src/models/DTO/user/userLogin.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() userLoginDTO: UserLoginDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.login(userLoginDTO);
    res.cookie('auth_token', token.access_token, {
      httpOnly: true, // Ngăn chặn truy cập từ client-side
      secure: process.env.NODE_ENV === 'production', // Chỉ dùng với HTTPS khi ở production
      maxAge: 36000000000, // Thời gian sống của cookie
    });
    return token;
  }

  @Post('forget-password')
  async resetPassword(@Body() userForgetPasswordDTO: UserForgetPasswordDTO) {
    return this.authService.resetPassword(userForgetPasswordDTO);
  }
}
