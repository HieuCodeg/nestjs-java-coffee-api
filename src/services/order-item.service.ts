import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemDTO } from 'src/models/DTO/orderItem/orderItem.dto';
import { OrderItemResponseDTO } from 'src/models/DTO/orderItem/orderItemResponse.dto';
import { ReportProductDTO } from 'src/models/DTO/report/reportProduct.dto';
import { OrderItem } from 'src/models/entities/orderItem.entity';
import { EnumOrderItemStatus } from 'src/models/enums/enumOrderItemStatus';
import { OrderItemRepository } from 'src/repositories/order-item.repository';
import { OrderService } from './order.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItemRepository)
    private readonly orderItemRepository: OrderItemRepository,

    private readonly orderService: OrderService,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find();
  }

  async getOrderItemDTOByOrderIdAndStatus(
    orderId: number,
    enumOrderItemStatus: EnumOrderItemStatus,
  ): Promise<OrderItemDTO[]> {
    return this.orderItemRepository.getOrderItemDTOByOrderIdAndStatus(
      orderId,
      enumOrderItemStatus,
    );
  }

  async getOrderItemDTOByOrderId(orderId: number): Promise<OrderItemDTO[]> {
    return this.orderItemRepository.getOrderItemDTOByOrderId(orderId);
  }

  async getOrderItemByProductAndSizeAndStatus(
    orderItemStatus: EnumOrderItemStatus,
    productId: number,
    size: string,
  ): Promise<OrderItemDTO[]> {
    return this.orderItemRepository.getOrderItemByProductAndSizeAndStatus(
      orderItemStatus,
      productId,
      size,
    );
  }

  async getOrderItemByProductAndSizeAndStatusAndTable(
    orderItemStatus: EnumOrderItemStatus,
    productId: number,
    size: string,
    orderId: number,
  ): Promise<OrderItemDTO[]> {
    return this.orderItemRepository.getOrderItemByProductAndSizeAndStatusAndTable(
      orderItemStatus,
      productId,
      size,
      orderId,
    );
  }

  async getOrderItemResponseDTOByOrderIdAndOrderItemStatus(
    orderId: number,
    enumOrderItemStatus: EnumOrderItemStatus,
  ): Promise<OrderItemResponseDTO[]> {
    return this.orderItemRepository.getOrderItemResponseDTOByOrderIdAndOrderItemStatus(
      orderId,
      enumOrderItemStatus,
    );
  }

  async getOrderItemResponseDTOByOrderId(
    orderId: number,
  ): Promise<OrderItemResponseDTO[]> {
    return this.orderItemRepository.getOrderItemResponseDTOByOrderId(orderId);
  }

  async getOrderItemByStatusGroupByProduct(
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<any[]> {
    return this.orderItemRepository.getOrderItemByStatusGroupByProduct(
      orderItemStatus,
    );
  }

  async getOrderItemByStatusWithTable(
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<any[]> {
    return this.orderItemRepository.getOrderItemByStatusWithTable(
      orderItemStatus,
    );
  }

  async getOrderItemByStatusAndTable(
    orderItemStatus: EnumOrderItemStatus,
    tableId: number,
  ): Promise<any[]> {
    return this.orderItemRepository.getOrderItemByStatusAndTable(
      orderItemStatus,
      tableId,
    );
  }

  async changeStatusFromCookingToWaiterToProduct(
    productId: number,
    size: string,
  ): Promise<void> {
    const orderItemList = await this.getOrderItemByProductAndSizeAndStatus(
      EnumOrderItemStatus.COOKING,
      productId,
      size,
    );

    if (orderItemList.length === 0) return;

    const orderItemDTO = orderItemList[0];
    let newOrderItem: OrderItem;

    if (orderItemDTO.quantity === 1) {
      newOrderItem = orderItemDTO.toOrderItem();
      const amount = orderItemDTO.price * orderItemDTO.quantity;
      await this.orderItemRepository.updateAmount(amount, orderItemDTO.id);
    } else {
      const quantity = orderItemDTO.quantity - 1;

      await this.orderItemRepository.updateQuantity(quantity, orderItemDTO.id);

      const amount = orderItemDTO.price * quantity;
      await this.orderItemRepository.updateAmount(amount, orderItemDTO.id);

      const timeCreated = orderItemDTO.createdAt;
      newOrderItem = new OrderItem();
      newOrderItem.id = null;
      newOrderItem.size = orderItemDTO.size;
      newOrderItem.price = orderItemDTO.price;
      newOrderItem.quantity = 1;
      newOrderItem.quantityDelivery = 0;
      newOrderItem.amount = orderItemDTO.price;
      newOrderItem.note = orderItemDTO.note;
      newOrderItem.tableId = orderItemDTO.tableId;
      newOrderItem.product = orderItemDTO.product.toProduct();
      newOrderItem.order = orderItemDTO.order.toOrder();
      newOrderItem.orderItemStatus = EnumOrderItemStatus.WAITER;
      newOrderItem.createdAt = timeCreated;
    }

    await this.checkExitsOrderItemWithStatus(
      newOrderItem,
      EnumOrderItemStatus.WAITER,
    );
  }

  async changeStatusFromCookingToWaiterToTable(
    orderItem: OrderItem,
  ): Promise<void> {
    let newOrderItem: OrderItem;

    if (orderItem.quantity === 1) {
      newOrderItem = orderItem;
      await this.orderItemRepository.remove(orderItem);
    } else {
      const quantity = orderItem.quantity - 1;
      const amount = orderItem.price * quantity;

      await this.orderItemRepository.updateQuantity(quantity, orderItem.id);
      await this.orderItemRepository.updateAmount(amount, orderItem.id);

      newOrderItem = this.orderItemRepository.create({
        size: orderItem.size,
        price: orderItem.price,
        quantity: 1,
        quantityDelivery: 0,
        amount: orderItem.price,
        note: orderItem.note,
        tableId: orderItem.tableId,
        product: orderItem.product,
        order: orderItem.order,
        orderItemStatus: EnumOrderItemStatus.WAITER,
        createdAt: orderItem.createdAt,
      });
    }
    await this.checkExitsOrderItemWithStatus(
      newOrderItem,
      EnumOrderItemStatus.WAITER,
    );
  }

  async changeStatusFromWaiterToDeliveryToTable(
    orderItem: OrderItem,
  ): Promise<void> {
    let newOrderItem: OrderItem;

    if (orderItem.quantity === 1) {
      newOrderItem = orderItem;
      await this.orderItemRepository.remove(orderItem);
    } else {
      const quantity = orderItem.quantity - 1;
      const amount = orderItem.price * quantity;

      await this.orderItemRepository.updateQuantity(quantity, orderItem.id);
      await this.orderItemRepository.updateAmount(amount, orderItem.id);

      newOrderItem = this.orderItemRepository.create({
        size: orderItem.size,
        price: orderItem.price,
        quantity: 1,
        quantityDelivery: 0,
        amount: orderItem.price,
        note: orderItem.note,
        tableId: orderItem.tableId,
        product: orderItem.product,
        order: orderItem.order,
        orderItemStatus: EnumOrderItemStatus.WAITER,
        createdAt: orderItem.createdAt,
      });
    }

    await this.checkExitsOrderItemWithStatus(
      newOrderItem,
      EnumOrderItemStatus.DELIVERY,
    );
  }

  async checkExitsOrderItemWithStatus(
    itemNew: OrderItem,
    status: EnumOrderItemStatus,
  ): Promise<void> {
    itemNew.orderItemStatus = status;

    const orderId = itemNew.order.id;
    const order = await this.orderService.findById(orderId);

    if (!order) return;

    const orderItemListCurrent =
      await this.orderItemRepository.getAllByOrderIdAndStatus(orderId, status);

    if (orderItemListCurrent.length === 0) {
      const createdAt = itemNew.createdAt;
      await this.orderItemRepository.save(itemNew);
      await this.orderItemRepository.updateCreatedAt(createdAt, itemNew.id);
    } else {
      for (const itemCurrent of orderItemListCurrent) {
        if (
          itemNew.product.id === itemCurrent.product.id &&
          itemNew.size === itemCurrent.size
        ) {
          itemNew.amount = itemNew.price * itemNew.quantity;
          itemCurrent.quantity += itemNew.quantity;
          itemCurrent.amount += itemNew.amount;

          if (itemNew.id) {
            await this.orderItemRepository.remove(itemNew);
          }

          await this.orderItemRepository.save(itemCurrent.toOrderItem());
          break;
        } else {
          const createdAt = itemNew.createdAt;
          await this.orderItemRepository.save(itemNew);
          await this.orderItemRepository.updateCreatedAt(createdAt, itemNew.id);
        }
      }
    }

    order.totalAmount = await this.orderService.calculateTotalAmount(orderId);
    await this.orderService.save(order);
  }

  async checkExitsOrderItemWithWaiter(itemNew: OrderItem): Promise<void> {
    itemNew.orderItemStatus = EnumOrderItemStatus.WAITER;

    const orderId = itemNew.order.id;
    const order = await this.orderService.findById(orderId);

    if (!order) return;

    const orderItemListCurrent =
      await this.orderItemRepository.getAllByOrderIdAndStatus(
        orderId,
        EnumOrderItemStatus.WAITER,
      );

    if (orderItemListCurrent.length === 0) {
      const createdAt = itemNew.createdAt;
      await this.orderItemRepository.save(itemNew);
      await this.orderItemRepository.updateCreatedAt(createdAt, itemNew.id);
    } else {
      for (const itemCurrent of orderItemListCurrent) {
        if (
          itemNew.product.id === itemCurrent.product.id &&
          itemNew.size === itemCurrent.size
        ) {
          itemCurrent.quantity += itemNew.quantity;
          itemCurrent.amount += itemNew.amount;

          await this.orderItemRepository.remove(itemNew);
          await this.orderItemRepository.save(itemCurrent.toOrderItem());
          break;
        } else {
          const createdAt = itemNew.createdAt;
          await this.orderItemRepository.save(itemNew);
          await this.orderItemRepository.updateCreatedAt(createdAt, itemNew.id);
        }
      }
    }

    order.totalAmount = await this.orderService.calculateTotalAmount(orderId);
    await this.orderService.save(order);
  }

  async checkExitsOrderItemWithDelivery(itemNew: OrderItem): Promise<void> {
    const orderId = itemNew.order.id;
    const order = await this.orderService.findById(orderId);

    if (!order) return;

    const orderItemListCurrent =
      await this.orderItemRepository.getAllByOrderIdAndStatus(
        orderId,
        EnumOrderItemStatus.DELIVERY,
      );

    let found = false;

    for (const itemCurrent of orderItemListCurrent) {
      if (
        itemNew.product.id === itemCurrent.product.id &&
        itemNew.size === itemCurrent.size
      ) {
        itemCurrent.quantity += itemNew.quantity;
        itemCurrent.amount += itemNew.amount;

        await this.orderItemRepository.remove(itemNew);
        await this.orderItemRepository.save(itemCurrent.toOrderItem());
        found = true;
        break;
      }
    }

    if (!found) {
      itemNew.orderItemStatus = EnumOrderItemStatus.DELIVERY;
      const createdAt = itemNew.createdAt;
      await this.orderItemRepository.save(itemNew);
      await this.orderItemRepository.updateCreatedAt(createdAt, itemNew.id);
    }

    order.totalAmount = await this.orderService.calculateTotalAmount(orderId);
    await this.orderService.save(order);
  }

  async checkExitsOrderItemWithDone(itemNew: OrderItem): Promise<void> {
    const orderId = itemNew.order.id;
    const order = await this.orderService.findById(orderId);

    if (!order) return;

    const orderItemListCurrent =
      await this.orderItemRepository.getAllByOrderIdAndStatus(
        orderId,
        EnumOrderItemStatus.DONE,
      );

    let found = false;

    for (const itemCurrent of orderItemListCurrent) {
      if (
        itemNew.product.id === itemCurrent.product.id &&
        itemNew.size === itemCurrent.size
      ) {
        itemCurrent.quantity += itemNew.quantity;
        itemCurrent.amount += itemNew.amount;

        await this.orderItemRepository.remove(itemNew);
        await this.orderItemRepository.save(itemCurrent.toOrderItem());
        found = true;
        break;
      }
    }

    if (!found) {
      itemNew.orderItemStatus = EnumOrderItemStatus.DONE;
      const createdAt = itemNew.createdAt;
      await this.orderItemRepository.save(itemNew);
      await this.orderItemRepository.updateCreatedAt(createdAt, itemNew.id);
    }

    order.totalAmount = await this.orderService.calculateTotalAmount(orderId);
    await this.orderService.save(order);
  }

  async getById(id: number): Promise<OrderItem> {
    return this.orderItemRepository.findOne({ where: { id } });
  }

  async findById(id: number): Promise<OrderItem | undefined> {
    return this.orderItemRepository.findOne({
      where: { id },
    });
  }
  async save(orderItem: OrderItem): Promise<OrderItem> {
    return this.orderItemRepository.save(orderItem);
  }

  async remove(id: number): Promise<void> {
    await this.orderItemRepository.delete(id);
  }

  async removeWithQuantity(
    orderItem: OrderItem,
    quantity: number,
  ): Promise<void> {
    if (quantity === orderItem.quantity) {
      await this.remove(orderItem.id);
    } else {
      const newQuantity = orderItem.quantity - quantity;
      await this.updateQuantity(newQuantity, orderItem.id);
    }
  }

  async softDelete(id: number): Promise<void> {
    await this.orderItemRepository.softDelete(id);
  }

  async updateStatus(
    orderItemStatus: EnumOrderItemStatus,
    orderItemId: number,
  ): Promise<void> {
    await this.orderItemRepository.updateStatus(orderItemStatus, orderItemId);
  }

  async updateQuantity(quantity: number, orderItemId: number): Promise<void> {
    await this.orderItemRepository.updateQuantity(quantity, orderItemId);
  }

  async getTop5Product(): Promise<ReportProductDTO[]> {
    return this.getTop5Product();
  }
}
