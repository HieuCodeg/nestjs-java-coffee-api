import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderDTO } from 'src/models/DTO/order/order.dto';
import { OrderCountCurrentMonthDTO } from 'src/models/DTO/order/orderCountCurrentMonth.dto';
import { OrderCreateWithOrderItemDTO } from 'src/models/DTO/order/orderCreateWithOrderItem.dto';
import { OrderKitchenDTO } from 'src/models/DTO/order/orderKitchen.dto';
import { OrderPayDTO } from 'src/models/DTO/order/orderPay.dto';
import { OrderResponseDTO } from 'src/models/DTO/order/orderResponse.dto';
import { OrderItemKitchenTableDTO } from 'src/models/DTO/orderItem/orderItemKitchenTable.dto';
import { OrderItemResponseDTO } from 'src/models/DTO/orderItem/orderItemResponse.dto';
import { ReportDTO } from 'src/models/DTO/report/report.dto';
import { ReportDayToDayDTO } from 'src/models/DTO/report/reportDayToDay.dto';
import { ReportYearDTO } from 'src/models/DTO/report/reportYear.dto';
import { Order } from 'src/models/entities/order.entity';
import { OrderItem } from 'src/models/entities/orderItem.entity';
import { EnumOrderItemStatus } from 'src/models/enums/enumOrderItemStatus';
import { EnumOrderStatus } from 'src/models/enums/enumOrderStatus';
import { EnumTableStatus } from 'src/models/enums/enumTableStatus';
import { OrderRepository } from 'src/repositories/order.repository';
import { OrderItemService } from './order-item.service';
import { ProductService } from './product.service';
import { StaffServiceImpl } from './staff.service';
import { TableService } from './table.service';

@Injectable()
export class OrderService {
  private static readonly SECRET_KEY =
    'GoiTenToiNheBanThanHoiCoToiLuonCungChiaSotDeRoiTaLaiCoThemNiemTin';
  public static readonly JWT_TOKEN_VALIDITY = 1000 * 60 * 60 * 24; // 24 hours in milliseconds

  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    private readonly tableService: TableService,
    private readonly staffService: StaffServiceImpl,
    private readonly productService: ProductService,
    private readonly orderItemService: OrderItemService,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async getAllOrderDTOWhereDeletedIsFalse(): Promise<OrderDTO[]> {
    return this.orderRepository.getAllOrderDTOWhereDeletedIsFalse();
  }

  async getAllOrderDTOByDayToDay(
    startDay: string,
    endDay: string,
  ): Promise<OrderDTO[]> {
    return this.orderRepository.getAllOrderDTOByDayToDay(startDay, endDay);
  }

  async getOrderDTOByStatus(orderStatus: EnumOrderStatus): Promise<OrderDTO[]> {
    return this.orderRepository.getOrderDTOByStatus(orderStatus);
  }

  async getAllOrderKitchenByTable(
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<OrderKitchenDTO[]> {
    const orderList: OrderKitchenDTO[] = [];
    const orderDTOList = await this.getOrderDTOByStatus(EnumOrderStatus.UNPAID);

    for (const item of orderDTOList) {
      const table = item.table;
      const orderItemList =
        await this.orderItemService.getOrderItemByStatusAndTable(
          orderItemStatus,
          table.id,
        );

      if (orderItemList.length !== 0) {
        const countProduct = this.countProductInOrder(orderItemList);
        const orderKitchenDTO: OrderKitchenDTO = {
          orderId: item.id,
          tableId: table.id,
          tableName: table.name,
          countProduct,
          timeWait: item.createdAt,
          orderItems: orderItemList,
        };
        orderList.push(orderKitchenDTO);
      }
    }

    return orderList;
  }

  countProductInOrder(orderItemList: OrderItemKitchenTableDTO[]): number {
    return orderItemList.reduce((count, item) => count + item.quantity, 0);
  }

  async getById(id: number): Promise<Order> {
    return this.orderRepository.findOneBy({ id });
  }

  async findById(id: number): Promise<Order | undefined> {
    return this.orderRepository.findOneBy({ id });
  }

  async save(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async getOrderDTOByTableIdAndOrderStatus(
    tableId: number,
    orderStatus: EnumOrderStatus,
  ): Promise<OrderDTO[]> {
    return this.orderRepository.getOrderDTOByTableIdAndOrderStatus(
      tableId,
      orderStatus,
    );
  }

  async createWithOrderItems(
    orderCreateWithOrderItemDTO: OrderCreateWithOrderItemDTO,
  ): Promise<OrderResponseDTO> {
    const { tableId, staffId, orderItems } = orderCreateWithOrderItemDTO;

    const table = await this.tableService.findById(tableId);
    const staff = await this.staffService.findById(staffId);

    if (!table || !staff) {
      throw new NotFoundException('Table or staff not found.');
    }

    let order = new Order();
    order.totalAmount = 0;
    order.table = table;
    order.staff = staff;
    order.orderStatus = EnumOrderStatus.UNPAID;

    order = await this.orderRepository.save(order);

    let totalAmount = 0;

    for (const item of orderItems) {
      const product = await this.productService.findById(item.productId);

      if (!product) {
        throw new BadRequestException('Invalid product ID.');
      }

      const price = item.price;
      const quantity = item.quantity;
      const amount = price * quantity;

      const orderItem = new OrderItem();
      orderItem.size = item.size;
      orderItem.price = price;
      orderItem.quantity = quantity;
      orderItem.quantityDelivery = 0;
      orderItem.amount = amount;
      orderItem.note = item.note;
      orderItem.tableId = tableId;
      orderItem.product = product;
      orderItem.order = order;
      orderItem.orderItemStatus = EnumOrderItemStatus.COOKING;

      await this.orderItemService.save(orderItem);

      totalAmount += amount;
    }

    order.totalAmount = totalAmount;
    order = await this.orderRepository.save(order);

    const orderItemResponseDTOs =
      await this.orderItemService.getOrderItemResponseDTOByOrderId(order.id);

    return {
      orderId: order.id,
      staffId: order.staff.id,
      tableId: order.table.id,
      totalAmount: order.totalAmount,
      orderItems: orderItemResponseDTOs,
    };
  }

  async updateWithOrderItems(
    orderCreateWithOrderItemDTO: OrderCreateWithOrderItemDTO,
  ): Promise<OrderResponseDTO> {
    const { orderId, orderItems } = orderCreateWithOrderItemDTO;

    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new NotFoundException('ID hóa đơn không hợp lệ.');
    }

    const currentOrderItems =
      await this.orderItemService.getOrderItemResponseDTOByOrderIdAndOrderItemStatus(
        orderId,
        EnumOrderItemStatus.COOKING,
      );

    const orderItemResponseResult: OrderItemResponseDTO[] = [
      ...currentOrderItems,
    ];

    for (const itemNew of orderItems) {
      const existingItemIndex = currentOrderItems.findIndex(
        (itemCurrent) =>
          itemNew.productId === itemCurrent.productId &&
          itemNew.size === itemCurrent.size,
      );

      if (existingItemIndex !== -1) {
        const itemCurrent = currentOrderItems[existingItemIndex];
        itemNew.amount = itemNew.price * itemNew.quantity;

        itemCurrent.quantity += itemNew.quantity;
        itemCurrent.amount += itemNew.amount;

        orderItemResponseResult[existingItemIndex] = itemCurrent;
      } else {
        const product = await this.productService.findById(itemNew.productId);

        if (!product) {
          throw new BadRequestException('ID sản phẩm không hợp lệ.');
        }

        orderItemResponseResult.push(itemNew.toOrderItemResponseDTO(product));
      }
    }

    for (const item of currentOrderItems) {
      if (!orderItemResponseResult.find((newItem) => newItem.id === item.id)) {
        await this.orderItemService.remove(item.id);
      }
    }

    for (const item of orderItemResponseResult) {
      const product = await this.productService.findById(item.productId);

      if (!product) {
        throw new BadRequestException('ID sản phẩm không hợp lệ.');
      }

      item.orderItemStatus = EnumOrderItemStatus.COOKING;
      await this.orderItemService.save(item.toOrderItem(product, order));
    }

    order.totalAmount = await this.calculateTotalAmount(orderId);
    await this.orderRepository.save(order);

    const updatedOrderItems =
      await this.orderItemService.getOrderItemResponseDTOByOrderId(order.id);

    return {
      orderId: order.id,
      staffId: order.staff.id,
      tableId: order.table.id,
      totalAmount: order.totalAmount,
      orderItems: updatedOrderItems,
    };
  }

  async calculateTotalAmount(orderId: number): Promise<number> {
    const orderItemList =
      await this.orderItemService.getOrderItemDTOByOrderId(orderId);
    let totalAmount = 0;

    for (const item of orderItemList) {
      const amount = item.price * item.quantity;
      item.amount = amount;
      totalAmount = totalAmount + amount;
    }

    return totalAmount;
  }

  async countOrderOfCurrentDay(): Promise<OrderCountCurrentMonthDTO[]> {
    return this.orderRepository.countOrderOfCurrentDay();
  }

  async softDelete(id: number): Promise<void> {
    await this.orderRepository.softDelete(id);
  }

  async getReportByYear(year: number): Promise<ReportYearDTO[]> {
    return this.orderRepository.getReportByYear(year);
  }

  async getReportByMonth(
    month: number,
    year: number,
  ): Promise<ReportYearDTO[]> {
    return this.orderRepository.getReportByMonth(month, year);
  }

  async getReportOfCurrentMonth(): Promise<ReportDTO[]> {
    return this.orderRepository.getReportOfCurrentMonth();
  }

  async getReportOfDay(day: string): Promise<ReportDTO[]> {
    return this.orderRepository.getReportOfDay(day);
  }

  async getReportFromDayToDay(
    startDay: string,
    endDay: string,
  ): Promise<ReportDayToDayDTO[]> {
    return this.orderRepository.getReportFromDayToDay(startDay, endDay);
  }

  async deleteOrderById(orderId: number): Promise<void> {
    const orderItemDTOList =
      await this.orderItemService.getOrderItemDTOByOrderIdAndStatus(
        orderId,
        EnumOrderItemStatus.COOKING,
      );

    for (const orderItemDTO of orderItemDTOList) {
      await this.orderItemService.remove(orderItemDTO.id);
    }

    const orderItemList =
      await this.orderItemService.getOrderItemDTOByOrderId(orderId);

    if (orderItemList.length === 0) {
      await this.remove(orderId);
    } else {
      throw new Error(
        'Hiện tại vẫn còn sản phẩm đang chờ làm hoặc chờ cung ứng! Không thể hủy!',
      );
    }
  }

  async pay(order: Order): Promise<OrderPayDTO> {
    const orderItemDTOList =
      await this.orderItemService.getOrderItemDTOByOrderIdAndStatus(
        order.id,
        EnumOrderItemStatus.COOKING,
      );

    for (const orderItemDTO of orderItemDTOList) {
      await this.orderItemService.remove(orderItemDTO.id);
    }

    const orderItemList = await this.orderItemService.getOrderItemDTOByOrderId(
      order.id,
    );

    for (const item of orderItemList) {
      if (item.orderItemStatus === EnumOrderItemStatus.WAITER) {
        throw new Error(
          'Hiện tại vẫn còn sản phẩm đang chờ cung ứng! Không thể thanh toán!',
        );
      }
    }

    for (const item of orderItemList) {
      if (item.orderItemStatus === EnumOrderItemStatus.DELIVERY) {
        await this.orderItemService.checkExitsOrderItemWithDone(
          item.toOrderItem(),
        );
      }
    }

    const orderPayDTO: OrderPayDTO = {
      orderId: order.id,
      totalAmount: order.totalAmount,
      staffName: (await this.staffService.findById(order.staff.id)).fullName,
      tableName: (await this.tableService.findById(order.table.id)).name,
      creatAt: order.createdAt,
      orderItems: await this.orderItemService.getOrderItemResponseDTOByOrderId(
        order.id,
      ),
    };

    order.orderStatus = EnumOrderStatus.PAID;
    (await this.tableService.findById(order.table.id)).status =
      EnumTableStatus.EMPTY;

    await this.save(order);
    await this.tableService.save(order.table);

    return orderPayDTO;
  }
}
