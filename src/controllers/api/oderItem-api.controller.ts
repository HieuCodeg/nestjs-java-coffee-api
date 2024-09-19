import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  Res,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { OrderKitChenResponseDTO } from 'src/models/DTO/order/orderKitChenResponse.dto';
import { EnumOrderItemStatus } from 'src/models/enums/enumOrderItemStatus';
import { EnumOrderStatus } from 'src/models/enums/enumOrderStatus';
import { OrderItemService } from 'src/services/order-item.service';
import { OrderService } from 'src/services/order.service';

@UseGuards(JwtAuthGuard)
@Controller('api/order-items')
export class OrderItemController {
  constructor(
    private readonly orderItemService: OrderItemService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  //   @Roles('ADMIN', 'CASHIER')
  //   @UseGuards(RolesGuard)
  async getByOrderId(@Query('orderId') orderId: string, @Res() res: Response) {
    let oid: number;

    try {
      oid = parseInt(orderId, 10);
      const orderOptional = await this.orderService.findById(oid);
      if (!orderOptional)
        throw new BadRequestException('Hóa đơn không tồn tại.');
    } catch (error) {
      throw new BadRequestException('ID hóa đơn không hợp lệ.');
    }

    const orderItems =
      await this.orderItemService.getOrderItemDTOByOrderId(oid);
    if (orderItems.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(orderItems);
  }

  @Get('/cashier')
  //   @Roles('ADMIN', 'CASHIER')
  //   @UseGuards(RolesGuard)
  async getOrderItemResponseDTOByOrderId(
    @Query('orderId') orderId: string,
    @Res() res: Response,
  ) {
    let oid: number;

    try {
      oid = parseInt(orderId, 10);
      const orderOptional = await this.orderService.findById(oid);
      if (!orderOptional)
        throw new BadRequestException('Hóa đơn không tồn tại.');
      if (orderOptional.orderStatus === EnumOrderStatus.PAID) {
        throw new BadRequestException('Hóa đơn đã thanh toán.');
      }
    } catch (error) {
      throw new BadRequestException('ID hóa đơn không hợp lệ.');
    }

    const orderItems =
      await this.orderItemService.getOrderItemResponseDTOByOrderId(oid);
    if (orderItems.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(orderItems);
  }

  @Get('/kitchen/get-by-status-cooking')
  //   @Roles('ADMIN', 'CASHIER')
  //   @UseGuards(RolesGuard)
  async getByStatusCooking(@Res() res: Response) {
    const orderItemList =
      await this.orderItemService.getOrderItemByStatusGroupByProduct(
        EnumOrderItemStatus.COOKING,
      );

    if (orderItemList.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(orderItemList);
  }

  @Get('/kitchen/get-by-status-waiter')
  //   @Roles('ADMIN', 'CASHIER')
  //   @UseGuards(RolesGuard)
  async getByStatusWaiter(@Res() res: Response) {
    const orderItemList =
      await this.orderItemService.getOrderItemByStatusWithTable(
        EnumOrderItemStatus.WAITER,
      );

    if (orderItemList.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(orderItemList);
  }

  @Get('/kitchen/get-by-status-cooking-group-table')
  //   @Roles('ADMIN', 'CASHIER')
  //   @UseGuards(RolesGuard)
  async getByStatusCookingGroupTable(@Res() res: Response) {
    const orderList = await this.orderService.getAllOrderKitchenByTable(
      EnumOrderItemStatus.COOKING,
    );

    if (orderList.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }
    return res.status(HttpStatus.OK).json(orderList);
  }

  @Post('/kitchen/change-status-cooking-to-waiter-to-product-all')
  //   @Roles('ADMIN', 'CASHIER')
  //   @UseGuards(RolesGuard)
  async changeStatusFromCookingToWaiterToProductAll(
    @Body('productId') productId: string,
    @Body('size') size: string,
    @Res() res: Response,
  ) {
    let pid: number;

    try {
      pid = parseInt(productId, 10);
    } catch (error) {
      throw new BadRequestException('ID sản phẩm không hợp lệ.');
    }

    const orderItemList =
      await this.orderItemService.getOrderItemByProductAndSizeAndStatus(
        EnumOrderItemStatus.COOKING,
        pid,
        size.toUpperCase().trim(),
      );

    if (orderItemList.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }

    const orderIdListChangeCurrent: number[] = [];

    for (const orderItemDTO of orderItemList) {
      await this.orderItemService.checkExitsOrderItemWithWaiter(
        orderItemDTO.toOrderItem(),
      );
      orderIdListChangeCurrent.push(orderItemDTO.order.id);
    }

    const orderIdListChange = Array.from(new Set(orderIdListChangeCurrent));
    const orderItemResponseList =
      await this.orderItemService.getOrderItemByStatusWithTable(
        EnumOrderItemStatus.WAITER,
      );

    const orderKitChenResponseDTO = {
      orderIdListChange,
      orderItemResponseList,
    };

    return res.status(HttpStatus.OK).json(orderKitChenResponseDTO);
  }

  @Post('/kitchen/change-status-cooking-to-waiter-to-table-all')
  //   @Roles('ADMIN', 'CASHIER')
  //   @UseGuards(RolesGuard)
  async changeStatusFromCookingToWaiterToTableAll(
    @Body('orderId') orderId: string,
    @Res() res: Response,
  ) {
    let oid: number;

    try {
      oid = parseInt(orderId, 10);
      const orderOptional = await this.orderService.findById(oid);
      if (!orderOptional)
        throw new BadRequestException('Hóa đơn không tồn tại.');
      if (orderOptional.orderStatus === EnumOrderStatus.PAID) {
        throw new BadRequestException('Hóa đơn đã thanh toán.');
      }
    } catch (error) {
      throw new BadRequestException('ID hóa đơn không hợp lệ.');
    }

    const orderItemList =
      await this.orderItemService.getOrderItemDTOByOrderIdAndStatus(
        oid,
        EnumOrderItemStatus.COOKING,
      );

    if (orderItemList.length === 0) {
      return res.status(HttpStatus.NO_CONTENT).send();
    }

    for (const orderItemDTO of orderItemList) {
      await this.orderItemService.checkExitsOrderItemWithWaiter(
        orderItemDTO.toOrderItem(),
      );
    }

    const orderItemResponseList =
      await this.orderItemService.getOrderItemByStatusWithTable(
        EnumOrderItemStatus.WAITER,
      );

    return res.status(HttpStatus.OK).json(orderItemResponseList);
  }

  @Post('change-status-cooking-to-waiter-to-product-of-table')
  //   @Roles('ADMIN', 'CASHIER')
  async changeStatusFromCookingToWaiterToProductOfOrder(
    @Body('orderId') orderId: string,
    @Body('productId') productId: string,
    @Body('size') size: string,
  ) {
    let pid: number;
    let oid: number;

    try {
      pid = parseInt(productId);
    } catch (e) {
      throw new BadRequestException('ID sản phẩm không hợp lệ.');
    }

    try {
      oid = parseInt(orderId);
      const order = await this.orderService.findById(oid);
      if (!order) throw new BadRequestException('Hóa đơn không tồn tại.');
      if (order.orderStatus === EnumOrderStatus.PAID)
        throw new BadRequestException('Hóa đơn đã thanh toán.');
    } catch (e) {
      throw new BadRequestException('ID hóa đơn không hợp lệ.');
    }

    const orderItemList =
      await this.orderItemService.getOrderItemByProductAndSizeAndStatusAndTable(
        EnumOrderItemStatus.COOKING,
        pid,
        size.trim().toUpperCase(),
        oid,
      );

    if (orderItemList.length === 0) {
      return { statusCode: HttpStatus.NO_CONTENT };
    }

    for (const orderItemDTO of orderItemList) {
      await this.orderItemService.checkExitsOrderItemWithWaiter(
        orderItemDTO.toOrderItem(),
      );
    }

    const orderItemResponseList =
      await this.orderItemService.getOrderItemByStatusWithTable(
        EnumOrderItemStatus.WAITER,
      );

    return { data: orderItemResponseList, statusCode: HttpStatus.OK };
  }

  @Post('change-status-cooking-to-waiter-to-product')
  //   @Roles('ADMIN', 'CASHIER')
  async changeStatusFromCookingToWaiterToProduct(
    @Body('productId') productId: string,
    @Body('size') size: string,
  ) {
    let pid: number;

    try {
      pid = parseInt(productId);
    } catch (e) {
      throw new BadRequestException('ID sản phẩm không hợp lệ.');
    }

    const orderItemList =
      await this.orderItemService.getOrderItemByProductAndSizeAndStatus(
        EnumOrderItemStatus.COOKING,
        pid,
        size.trim().toUpperCase(),
      );

    if (orderItemList.length === 0) {
      return { statusCode: HttpStatus.NO_CONTENT };
    }

    const orderIdListChange = [orderItemList[0].order.id];

    await this.orderItemService.changeStatusFromCookingToWaiterToProduct(
      pid,
      size,
    );

    const orderItemResponseList =
      await this.orderItemService.getOrderItemByStatusWithTable(
        EnumOrderItemStatus.WAITER,
      );

    const orderKitchenResponseDTO = new OrderKitChenResponseDTO();
    orderKitchenResponseDTO.orderIdChangeList = orderIdListChange;
    orderKitchenResponseDTO.orderItemResponseList = orderItemResponseList;

    return { data: orderKitchenResponseDTO, statusCode: HttpStatus.OK };
  }

  @Post('change-status-cooking-to-waiter-to-table')
  //   @Roles('ADMIN', 'CASHIER')
  async changeStatusFromCookingToWaiterToTable(
    @Body('orderItemId') orderItemId: string,
  ) {
    let oiId: number;

    try {
      oiId = parseInt(orderItemId);
      const orderItem = await this.orderItemService.findById(oiId);
      if (!orderItem)
        throw new BadRequestException('Id chi tiết hóa đơn không tồn tại.');

      if (orderItem.orderItemStatus === EnumOrderItemStatus.WAITER) {
        throw new BadRequestException('Sản phẩm đang chờ cung ứng.');
      }

      await this.orderItemService.changeStatusFromCookingToWaiterToTable(
        orderItem,
      );
    } catch (e) {
      throw new BadRequestException('ID chi tiết hóa đơn không hợp lệ.');
    }

    const orderItemResponseList =
      await this.orderItemService.getOrderItemByStatusWithTable(
        EnumOrderItemStatus.WAITER,
      );

    return { data: orderItemResponseList, statusCode: HttpStatus.OK };
  }

  @Post('change-status-waiter-to-delivery-to-table')
  //   @Roles('ADMIN', 'CASHIER')
  async changeStatusFromWaiterToDeliveryToTable(
    @Body('orderItemId') orderItemId: string,
  ) {
    let oiId: number;

    try {
      oiId = parseInt(orderItemId);
      const orderItem = await this.orderItemService.findById(oiId);
      if (!orderItem)
        throw new BadRequestException('Id chi tiết hóa đơn không tồn tại.');

      if (orderItem.orderItemStatus === EnumOrderItemStatus.DELIVERY) {
        throw new BadRequestException('Sản phẩm đang được giao.');
      }

      await this.orderItemService.changeStatusFromWaiterToDeliveryToTable(
        orderItem,
      );
    } catch (e) {
      throw new BadRequestException('ID chi tiết hóa đơn không hợp lệ.');
    }

    const orderItemResponseList =
      await this.orderItemService.getOrderItemByStatusWithTable(
        EnumOrderItemStatus.WAITER,
      );

    return { data: orderItemResponseList, statusCode: HttpStatus.OK };
  }

  @Post('change-status-waiter-to-delivery-to-product-of-table')
  //   @Roles('ADMIN', 'CASHIER')
  async changeStatusFromWaiterToDeliveryToProductOfOrder(
    @Body('orderItemId') orderItemId: string,
  ) {
    let oiId: number;

    try {
      oiId = parseInt(orderItemId);
      const orderItem = await this.orderItemService.findById(oiId);
      if (!orderItem)
        throw new BadRequestException('Id chi tiết hóa đơn không tồn tại.');

      if (orderItem.orderItemStatus === EnumOrderItemStatus.DELIVERY) {
        throw new BadRequestException('Sản phẩm đã làm xong đang chờ phục vụ.');
      }

      if (orderItem.orderItemStatus !== EnumOrderItemStatus.WAITER) {
        throw new BadRequestException('Sản phẩm chưa làm không thể phục vụ.');
      }

      await this.orderItemService.checkExitsOrderItemWithDelivery(orderItem);
    } catch (e) {
      throw new BadRequestException('ID chi tiết hóa đơn không hợp lệ.');
    }

    return { statusCode: HttpStatus.OK };
  }

  @Delete('delete/:orderItemId/quantity/:quantity')
  //   @Roles('ADMIN', 'CASHIER')
  async deleteWithQuantity(
    @Param('orderItemId') orderItemId: string,
    @Param('quantity') quantity: number,
  ) {
    const orderItem = await this.orderItemService.findById(
      parseInt(orderItemId),
    );
    if (!orderItem) {
      throw new BadRequestException('ID chi tiết hóa đơn không hợp lệ.');
    }

    if (orderItem.orderItemStatus !== EnumOrderItemStatus.COOKING) {
      throw new BadRequestException(
        'Đơn hàng đang chờ cung ứng hoặc chờ giao không thể xóa!',
      );
    }

    if (quantity < 0) {
      throw new BadRequestException('Số lượng âm không thể xóa.');
    }

    if (orderItem.quantity < quantity) {
      throw new BadRequestException(
        'Số lượng sản phẩm muốn xóa lớn hơn số lượng hiện có.',
      );
    }

    try {
      await this.orderItemService.removeWithQuantity(orderItem, quantity);
      return { statusCode: HttpStatus.ACCEPTED };
    } catch (e) {
      throw new BadRequestException(
        'Hệ thống đang có lỗi! Vui lòng thử lại sau!',
      );
    }
  }
}
