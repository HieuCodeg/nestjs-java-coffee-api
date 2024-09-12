import { Controller, Get, Param, Render, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { StaffServiceImpl } from 'src/services/staff.service';

@UseGuards(JwtAuthGuard)
@Controller('/cp/products')
export class ProductCPController {
  constructor(private readonly staffService: StaffServiceImpl) {}

  @Get()
  @Render('product/list') // Render trang danh sách sản phẩm
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
  @Render('product/create') // Render trang tạo sản phẩm mới
  async showCreatePage(@Req() req: Request) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO };
    }

    return null;
  }

  @Get('/:productId')
  @Render('product/view') // Render trang xem chi tiết sản phẩm
  async showViewProduct(
    @Req() req: Request,
    @Param('productId') productId: number,
  ) {
    if ('username' in req?.user) {
      const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
        String(req.user?.username),
      );
      return { staff: staffDTO, productId: productId };
    }

    return null;
  }
}
