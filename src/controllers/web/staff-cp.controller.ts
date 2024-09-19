import { Controller, Get, Param, Render, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { Staff } from 'src/models/entities/staff.entity';
import { StaffServiceImpl } from 'src/services/staff.service';

@UseGuards(JwtAuthGuard)
@Controller('/cp/staffs')
export class StaffCPController {
  constructor(private readonly staffService: StaffServiceImpl) {}

  @Get()
  @Render('staff/list') // Render trang danh sách nhân viên
  async showListPage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO };
    }

    return null;
  }

  @Get('/create')
  @Render('staff/create') // Render trang tạo nhân viên mới
  async showCreatePage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO };
    }

    return null;
  }

  @Get('/account-recovery')
  @Render('staff/recoveryStaff') // Render trang khôi phục tài khoản nhân viên
  async showListAccountRecoveryPage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO };
    }

    return null;
  }

  @Get('/:staffId')
  @Render('staff/view') // Render trang xem chi tiết nhân viên
  async showViewPage(@Req() req: Request, @Param('staffId') staffId: number) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      const viewer: Staff = await this.staffService.findById(staffId);
      return { staff: staffDTO, viewer: viewer.toStaffDTO() };
    }

    return null;
  }
}
