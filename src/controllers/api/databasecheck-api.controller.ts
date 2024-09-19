import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { DatabaseCheckServiceImpl } from 'src/services/database-check.service';

@UseGuards(JwtAuthGuard)
@Controller('api/check-database')
export class DatabaseCheckController {
  constructor(
    private readonly databaseCheckService: DatabaseCheckServiceImpl,
  ) {}

  @Get()
  async getDatabaseCheck(@Res() res: Response) {
    const databaseCheck = await this.databaseCheckService.getDatabaseCheck();
    return res.status(HttpStatus.OK).json(databaseCheck);
  }

  @Get('update-table')
  async updateTableCheck(@Res() res: Response) {
    const databaseCheck =
      await this.databaseCheckService.updateWithTableCheck();
    return res.status(HttpStatus.OK).json(databaseCheck);
  }

  @Get('update-product')
  async updateProductCheck(@Res() res: Response) {
    const databaseCheck =
      await this.databaseCheckService.updateWithProductCheck();
    return res.status(HttpStatus.OK).json(databaseCheck);
  }
}
