import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AppUtils } from 'src/common/app.untils';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { OrderCountCurrentMonthDTO } from 'src/models/DTO/order/orderCountCurrentMonth.dto';
import { OrderCreateDTO } from 'src/models/DTO/order/orderCreate.dto';
import { OrderCreateWithOrderItemDTO } from 'src/models/DTO/order/orderCreateWithOrderItem.dto';
import { Order } from 'src/models/entities/order.entity';
import { EnumOrderStatus } from 'src/models/enums/enumOrderStatus';
import { OrderService } from 'src/services/order.service';
import { StaffServiceImpl } from 'src/services/staff.service';
import { TableService } from 'src/services/table.service';

@UseGuards(JwtAuthGuard)
@Controller('api/orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly staffService: StaffServiceImpl,
    private readonly tableService: TableService,
    private readonly appUtils: AppUtils,
  ) {}

  @Get()
  async getAllByDeletedIsFalse(@Res() res: Response) {
    const orderDTOList =
      await this.orderService.getAllOrderDTOWhereDeletedIsFalse();
    if (orderDTOList.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(orderDTOList);
  }

  @Get('/day/:startDay/:endDay')
  async getAllOrderDTOByFromDayToDay(
    @Param('startDay') startDay: string,
    @Param('endDay') endDay: string,
    @Res() res: Response,
  ) {
    // Tách chuỗi startDay và endDay thành mảng
    const startDayArray = startDay.split('-');
    const endDayArray = endDay.split('-');

    // Điều chỉnh startDay (giảm 1 ngày)
    const startDayTemp =
      parseInt(startDayArray[startDayArray.length - 1], 10) - 1;
    startDayArray[startDayArray.length - 1] =
      startDayTemp < 10 ? `0${startDayTemp}` : `${startDayTemp}`;

    // Gộp lại thành chuỗi ngày
    startDay = startDayArray.join('-');

    // Điều chỉnh endDay (tăng 1 ngày)
    const endDayTemp = parseInt(endDayArray[endDayArray.length - 1], 10) + 1;
    endDayArray[endDayArray.length - 1] =
      endDayTemp < 10 ? `0${endDayTemp}` : `${endDayTemp}`;

    // Gộp lại thành chuỗi ngày
    endDay = endDayArray.join('-');

    // Lấy danh sách OrderDTO từ ngày bắt đầu đến ngày kết thúc
    const orderDTOList = await this.orderService.getAllOrderDTOByDayToDay(
      startDay,
      endDay,
    );

    // Nếu danh sách rỗng, trả về No Content
    if (orderDTOList.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }

    // Trả về danh sách OrderDTO với status OK
    return res.status(HttpStatus.OK).json(orderDTOList);
  }

  @Get('/count-order-current-day')
  // @Roles('ADMIN', 'CASHIER')
  async countOrderOfCurrentDay(@Res() res: Response) {
    const count: OrderCountCurrentMonthDTO[] =
      await this.orderService.countOrderOfCurrentDay();
    return res.status(HttpStatus.OK).json(Number(count[0].count));
  }

  @Get('/:orderId')
  async getById(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    const order = await this.orderService.findById(orderId);
    if (!order) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'ID hóa đơn không hợp lệ.' });
    }
    return res.status(HttpStatus.OK).json(order.toOrderDTO());
  }

  @Post()
  // @Roles('ADMIN', 'CASHIER')
  async createOrder(
    @Body(new ValidationPipe()) orderCreateDTO: OrderCreateDTO,
    @Res() res: Response,
  ) {
    const { tableId, staffId } = orderCreateDTO;

    const table = await this.tableService.findById(tableId);
    if (!table) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'ID bàn không hợp lệ.' });
    }

    const staff = await this.staffService.findById(staffId);
    if (!staff) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'ID nhân viên không hợp lệ.' });
    }

    let order = new Order();
    order.id = null;
    order.totalAmount = 0;
    order.table = table;
    order.staff = staff;

    order = await this.orderService.save(order);
    return res.status(HttpStatus.CREATED).json(order.toOrderDTO());
  }

  @Post('/create-with-order-item')
  // @Roles('ADMIN', 'CASHIER')
  // @UseGuards(RolesGuard)
  async createOrderWithOrderItem(
    @Body() orderCreateWithOrderItemDTO: OrderCreateWithOrderItemDTO,
    @Res() res: Response,
  ) {
    const tableId = orderCreateWithOrderItemDTO.tableId;
    const staffId = orderCreateWithOrderItemDTO.staffId;

    // Kiểm tra ID bàn
    const tableOptional = await this.tableService.findById(tableId);
    if (!tableOptional) {
      throw new BadRequestException('ID bàn không hợp lệ.');
    }

    // Kiểm tra ID nhân viên
    const staffOptional = await this.staffService.findById(staffId);
    if (!staffOptional) {
      throw new BadRequestException('ID nhân viên không hợp lệ.');
    }

    try {
      let orderReturnDTO;

      // Kiểm tra nếu orderId đã tồn tại, thì cập nhật
      if (orderCreateWithOrderItemDTO.orderId) {
        orderReturnDTO = await this.orderService.updateWithOrderItems(
          orderCreateWithOrderItemDTO,
        );
      } else {
        // Nếu chưa có orderId thì tạo mới
        orderReturnDTO = await this.orderService.createWithOrderItems(
          orderCreateWithOrderItemDTO,
        );
      }

      return res.status(HttpStatus.CREATED).json(orderReturnDTO);
    } catch (error) {
      console.error(error);
      return res.status(HttpStatus.BAD_REQUEST).send();
    }
  }

  @Delete('/delete/:orderId')
  // @Roles('ADMIN', 'CASHIER')
  async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    const order = await this.orderService.findById(orderId);
    if (!order) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'ID hóa đơn không hợp lệ.' });
    }

    await this.orderService.deleteOrderById(orderId);
    return res.status(HttpStatus.ACCEPTED).send();
  }

  @Get('/pay/:orderId')
  // @Roles('ADMIN', 'CASHIER')
  async pay(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Res() res: Response,
  ) {
    const order = await this.orderService.findById(orderId);
    if (!order) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'ID hóa đơn không hợp lệ.' });
    }

    if (order.orderStatus === EnumOrderStatus.PAID) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Hóa đơn đã thanh toán.' });
    }

    const orderPayDTO = await this.orderService.pay(order);
    return res.status(HttpStatus.OK).json(orderPayDTO);
  }
}
