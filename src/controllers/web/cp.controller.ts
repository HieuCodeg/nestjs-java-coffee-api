import {
  Controller,
  Get,
  Render,
  Param,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppUtils } from 'src/common/app.untils';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { User } from 'src/models/entities/user.entity';
import { StaffServiceImpl } from 'src/services/staff.service';
import { UserService } from 'src/services/user.service';

@Controller('/cp')
export class CPController {
  constructor(
    private readonly userService: UserService,
    private readonly appUtils: AppUtils,
    private readonly staffService: StaffServiceImpl,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @Render('index') // Render template 'cp/index'
  async showIndexPage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );

      return { staff: staffDTO };
    }

    return null;
  }

  @Get('/login')
  @Render('login') // Render template 'login'
  showLoginPage() {
    return;
  }

  @Get('/forget-password')
  @Render('forget-password') // Render template 'forget-password'
  showForgetPasswordPage() {
    return;
  }

  @Get('/update-password/:codeFirstLogin')
  async showUpdatePasswordPage(
    @Param('codeFirstLogin') codeFirstLogin: string,
    @Res() res: Response,
  ) {
    const user: User =
      await this.userService.findByCodeFirstLogin(codeFirstLogin);

    if (user && user.isFirstLogin && !user.deleted) {
      return res.render('update-password');
    }

    return res.render('error/expired-page');
  }

  @Get('/logout')
  async logout(@Res() res: Response) {
    // Xóa cookie auth_token
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Điều hướng người dùng về trang đăng nhập
    return res.redirect('/cp/login');
  }
}
