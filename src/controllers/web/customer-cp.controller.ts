import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { StaffServiceImpl } from 'src/services/staff.service';

@UseGuards(JwtAuthGuard)
@Controller('/cp/customers')
export class CustomerCPController {
  constructor(private readonly staffService: StaffServiceImpl) {}

  @Get()
  @Render('customer/list')
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
  @Render('cp/customer/create') // Render trang create EJS tương đương
  async showCreatePage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO };
    }

    return null;
  }
}
