import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { StaffServiceImpl } from 'src/services/staff.service';

@UseGuards(JwtAuthGuard)
@Controller('/cp/category')
export class CategoryCPController {
  constructor(private readonly staffService: StaffServiceImpl) {}

  @Get()
  @Render('category/list') // Render trang EJS tương đương với Spring
  async showListPage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO };
    }

    return null;
  }
}
