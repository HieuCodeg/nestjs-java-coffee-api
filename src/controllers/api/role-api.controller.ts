import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { RoleServiceImpl } from 'src/services/role.service';

@UseGuards(JwtAuthGuard)
@Controller('api/roles')
export class RoleAPI {
  constructor(private readonly roleService: RoleServiceImpl) {}

  @Get()
  async getAllRoleDTONoCustomer(@Res() res: Response) {
    const roleDTOS = await this.roleService.getAllRoleDTONoCustomer();

    if (roleDTOS.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }

    return res.status(HttpStatus.OK).json(roleDTOS);
  }

  @Get('no-ad-and-cus')
  async getAllRoleDTONoAdminAndCustomer(@Res() res: Response) {
    const roleDTOS = await this.roleService.getAllRoleDTONoAdminAndCustomer();

    if (roleDTOS.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }

    return res.status(HttpStatus.OK).json(roleDTOS);
  }
}
