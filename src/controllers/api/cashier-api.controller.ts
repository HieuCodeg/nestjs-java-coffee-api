import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { ProductService } from 'src/services/product.service';

@UseGuards(JwtAuthGuard)
@Controller('api/cashier')
export class CashierController {
  constructor(private readonly productService: ProductService) {}

  @Get('/products')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles(Role.ADMIN, Role.CASHIER)
  async getAllByDeletedIsFalseForCashier(@Res() res: Response) {
    const productCashierDTOS =
      await this.productService.getAllProductCashierDTOWhereDeletedIsFalse();

    if (!productCashierDTOS.length) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }

    return res.status(HttpStatus.OK).json(productCashierDTOS);
  }
}
