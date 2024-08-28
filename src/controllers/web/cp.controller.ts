import { Controller, Get, Render, Param } from '@nestjs/common';
import { AppUtils } from 'src/common/app.untils';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { User } from 'src/models/entities/user.entity';
import { StaffServiceImpl } from 'src/services/staff/staff.service';
import { UserService } from 'src/services/user/user.service';

@Controller('/cp')
export class CPController {
  constructor(
    private readonly userService: UserService,
    private readonly appUtils: AppUtils,
    private readonly staffService: StaffServiceImpl,
  ) {}

  @Get()
  @Render('cp/index') // Render template 'cp/index'
  async showIndexPage() {
    // const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
    //   this.appUtils.getUserName(),
    // );
    const staffDTO: StaffDTO = new StaffDTO();
    return { staff: staffDTO };
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
  ) {
    const user: User =
      await this.userService.findByCodeFirstLogin(codeFirstLogin);

    if (user && user.isFirstLogin && !user.deleted) {
      return { view: 'update-password' };
    }

    return { view: 'error/expired-page' };
  }
}
