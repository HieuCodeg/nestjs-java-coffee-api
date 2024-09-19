import {
  Controller,
  Get,
  Param,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { OrderItemService } from 'src/services/order-item.service';
import { OrderService } from 'src/services/order.service';

@UseGuards(JwtAuthGuard)
@Controller('api/report')
export class ReportController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderItemService: OrderItemService,
  ) {}

  @Get('day/:day')
  //   @Roles('ADMIN', 'CASHIER')
  async getReportOfDay(@Param('day') day: string) {
    const report = await this.orderService.getReportOfDay(day);

    if (report.length === 0) {
      throw new HttpException(
        `Ngày ${day} chưa có doanh thu!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return report[0].totalAmount;
  }

  @Get('year/:year')
  //   @Roles('ADMIN', 'CASHIER')
  async getReportByYear(@Param('year') year: number) {
    const reportMonth = await this.orderService.getReportByYear(year);

    if (reportMonth.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return reportMonth;
  }

  @Get('day/:startDay/:endDay')
  //   @Roles('ADMIN', 'CASHIER')
  async getReportFromDayToDay(
    @Param('startDay') startDay: string,
    @Param('endDay') endDay: string,
  ) {
    const adjustDate = (date: string, adjustment: number) => {
      const [year, month, day] = date.split('-').map(Number);
      const adjustedDate = new Date(year, month - 1, day + adjustment);
      return adjustedDate.toISOString().split('T')[0];
    };

    const adjustedStartDay = adjustDate(startDay, -1);
    const adjustedEndDay = adjustDate(endDay, 1);

    const report = await this.orderService.getReportFromDayToDay(
      adjustedStartDay,
      adjustedEndDay,
    );

    if (report.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return report;
  }

  @Get('month/:month-:year')
  //   @Roles('ADMIN', 'CASHIER')
  async getReportByMonth(
    @Param('month') month: number,
    @Param('year') year: number,
  ) {
    const reportMonth = await this.orderService.getReportByMonth(month, year);

    if (reportMonth.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return reportMonth;
  }

  @Get('month/current-month')
  //   @Roles('ADMIN', 'CASHIER')
  async getReportOfCurrentMonth() {
    const reportMonth = await this.orderService.getReportOfCurrentMonth();

    if (reportMonth.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return reportMonth[0].totalAmount;
  }

  @Get('product/top5')
  //   @Roles('ADMIN', 'CASHIER')
  async getTop5Product() {
    const reportProductDTOS = await this.orderItemService.getTop5Product();

    if (reportProductDTOS.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }

    return reportProductDTOS;
  }
}
