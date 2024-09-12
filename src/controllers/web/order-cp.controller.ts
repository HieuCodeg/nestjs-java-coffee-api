import { Controller, Get, Param, Render, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { StaffServiceImpl } from 'src/services/staff.service';

@UseGuards(JwtAuthGuard)
@Controller('/cp/orders')
export class OrderCPController {
  constructor(private readonly staffService: StaffServiceImpl) {}

  @Get()
  @Render('order/list') // Render trang danh sách order
  async showListPage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO };
    }

    return null;
  }

  @Get('/:orderId')
  @Render('order/view') // Render trang chi tiết order
  async showViewPage(@Req() req: Request, @Param('orderId') orderId: number) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO, orderId: orderId };
    }

    return null;
  }
}
