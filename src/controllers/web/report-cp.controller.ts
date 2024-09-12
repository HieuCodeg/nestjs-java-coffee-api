import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { StaffServiceImpl } from 'src/services/staff.service';

@UseGuards(JwtAuthGuard)
@Controller('/cp/report')
export class ReportCPController {
  constructor(private readonly staffService: StaffServiceImpl) {}

  @Get()
  @Render('report/index') // Render trang báo cáo
  async showReportPage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO };
    }

    return null;
  }
}
