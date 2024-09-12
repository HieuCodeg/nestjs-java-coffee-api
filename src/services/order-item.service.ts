import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItemDTO } from 'src/models/DTO/orderItem/orderItem.dto';
import { OrderItemResponseDTO } from 'src/models/DTO/orderItem/orderItemResponse.dto';
import { ReportProductDTO } from 'src/models/DTO/report/reportProduct.dto';
import { OrderItem } from 'src/models/entities/orderItem.entity';
import { EnumOrderItemStatus } from 'src/models/enums/enumOrderItemStatus';
import { Repository } from 'typeorm';
import { OrderService } from './order.service';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @Inject(forwardRef(() => OrderService))
    private readonly orderService: OrderService,
  ) {}

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find();
  }

  async getOrderItemDTOByOrderIdAndStatus(
    orderId: number,
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<OrderItemDTO[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'oi.size',
        'oi.price',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.amount',
        'oi.note',
        'oi.tableId',
        'oi.product',
        'oi.order',
        'oi.orderItemStatus',
        'oi.createdAt',
      ])
      .where('oi.deleted = :deleted', { deleted: false })
      .andWhere('oi.order.id = :orderId', { orderId })
      .andWhere('oi.orderItemStatus = :orderItemStatus', { orderItemStatus })
      .getRawMany<OrderItemDTO>();
  }

  async getOrderItemDTOByOrderId(orderId: number): Promise<OrderItemDTO[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'oi.size',
        'oi.price',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.amount',
        'oi.note',
        'oi.tableId',
        'oi.product',
        'oi.order',
        'oi.orderItemStatus',
        'oi.createdAt',
      ])
      .where('oi.deleted = :deleted', { deleted: false })
      .andWhere('oi.order.id = :orderId', { orderId })
      .getRawMany<OrderItemDTO>();
  }

  async getOrderItemByProductAndSizeAndStatus(
    orderItemStatus: EnumOrderItemStatus,
    productId: number,
    size: string,
  ): Promise<OrderItemDTO[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'oi.size',
        'oi.price',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.amount',
        'oi.note',
        'oi.tableId',
        'oi.product',
        'oi.order',
        'oi.orderItemStatus',
        'oi.createdAt',
      ])
      .where('oi.deleted = :deleted', { deleted: false })
      .andWhere('oi.orderItemStatus = :orderItemStatus', { orderItemStatus })
      .andWhere('oi.product.id = :productId', { productId })
      .andWhere('oi.size = :size', { size })
      .orderBy('oi.createdAt', 'ASC')
      .getRawMany<OrderItemDTO>();
  }

  async getOrderItemByProductAndSizeAndStatusAndTable(
    orderItemStatus: EnumOrderItemStatus,
    productId: number,
    size: string,
    orderId: number,
  ): Promise<OrderItemDTO[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'oi.size',
        'oi.price',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.amount',
        'oi.note',
        'oi.tableId',
        'oi.product',
        'oi.order',
        'oi.orderItemStatus',
        'oi.createdAt',
      ])
      .where('oi.deleted = :deleted', { deleted: false })
      .andWhere('oi.orderItemStatus = :orderItemStatus', { orderItemStatus })
      .andWhere('oi.product.id = :productId', { productId })
      .andWhere('oi.size = :size', { size })
      .andWhere('oi.order.id = :orderId', { orderId })
      .orderBy('oi.createdAt', 'ASC')
      .getRawMany<OrderItemDTO>();
  }

  async getOrderItemResponseDTOByOrderIdAndOrderItemStatus(
    orderId: number,
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<OrderItemResponseDTO[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'oi.size',
        'oi.price',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.amount',
        'oi.note',
        'oi.tableId',
        'oi.product',
        'oi.order',
        'oi.orderItemStatus',
      ])
      .where('oi.deleted = :deleted', { deleted: false })
      .andWhere('oi.order.id = :orderId', { orderId })
      .andWhere('oi.orderItemStatus = :orderItemStatus', { orderItemStatus })
      .getRawMany<OrderItemResponseDTO>();
  }

  async getOrderItemResponseDTOByOrderId(
    orderId: number,
  ): Promise<OrderItemResponseDTO[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'oi.size',
        'oi.price',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.amount',
        'oi.note',
        'oi.tableId',
        'oi.product',
        'oi.order',
        'oi.orderItemStatus',
      ])
      .where('oi.deleted = :deleted', { deleted: false })
      .andWhere('oi.order.id = :orderId', { orderId })
      .getRawMany<OrderItemResponseDTO>();
  }

  async getOrderItemByStatusGroupByProduct(
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<any[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'pd.id',
        'pd.title',
        'oi.size',
        'SUM(oi.quantity) as totalQuantity',
        'SUM(oi.quantityDelivery) as totalQuantityDelivery',
      ])
      .innerJoin('oi.product', 'pd')
      .where('oi.orderItemStatus = :orderItemStatus', { orderItemStatus })
      .groupBy('oi.product.id')
      .addGroupBy('oi.size')
      .getMany();
  }

  async getOrderItemByStatusWithTable(
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<any[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'oi.product.id',
        'pd.title',
        'tb.name',
        'oi.size',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.createdAt',
        'oi.updatedAt',
        'oi.order.id',
        'oi.tableId',
      ])
      .innerJoin('oi.product', 'pd')
      .innerJoin('oi.table', 'tb')
      .where('oi.orderItemStatus = :orderItemStatus', { orderItemStatus })
      .getMany();
  }

  async getOrderItemByStatusAndTable(
    orderItemStatus: EnumOrderItemStatus,
    tableId: number,
  ): Promise<any[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'tb.name',
        'pd.id',
        'pd.title',
        'oi.size',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.createdAt',
      ])
      .innerJoin('oi.product', 'pd')
      .innerJoin('oi.table', 'tb')
      .where('oi.orderItemStatus = :orderItemStatus', { orderItemStatus })
      .andWhere('oi.tableId = :tableId', { tableId })
      .orderBy('oi.createdAt', 'ASC')
      .getMany();
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
      await this.updateAmount(amount, orderItemDTO.id);
    } else {
      const quantity = orderItemDTO.quantity - 1;

      await this.updateQuantity(quantity, orderItemDTO.id);

      const amount = orderItemDTO.price * quantity;
      await this.updateAmount(amount, orderItemDTO.id);

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

      await this.updateQuantity(quantity, orderItem.id);
      await this.updateAmount(amount, orderItem.id);

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

      await this.updateQuantity(quantity, orderItem.id);
      await this.updateAmount(amount, orderItem.id);

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

    const orderItemListCurrent = await this.getAllByOrderIdAndStatus(
      orderId,
      status,
    );

    if (orderItemListCurrent.length === 0) {
      const createdAt = itemNew.createdAt;
      await this.orderItemRepository.save(itemNew);
      await this.updateCreatedAt(createdAt, itemNew.id);
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
          await this.updateCreatedAt(createdAt, itemNew.id);
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

    const orderItemListCurrent = await this.getAllByOrderIdAndStatus(
      orderId,
      EnumOrderItemStatus.WAITER,
    );

    if (orderItemListCurrent.length === 0) {
      const createdAt = itemNew.createdAt;
      await this.orderItemRepository.save(itemNew);
      await this.updateCreatedAt(createdAt, itemNew.id);
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
          await this.updateCreatedAt(createdAt, itemNew.id);
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

    const orderItemListCurrent = await this.getAllByOrderIdAndStatus(
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
      await this.updateCreatedAt(createdAt, itemNew.id);
    }

    order.totalAmount = await this.orderService.calculateTotalAmount(orderId);
    await this.orderService.save(order);
  }

  async checkExitsOrderItemWithDone(itemNew: OrderItem): Promise<void> {
    const orderId = itemNew.order.id;
    const order = await this.orderService.findById(orderId);

    if (!order) return;

    const orderItemListCurrent = await this.getAllByOrderIdAndStatus(
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
      await this.updateCreatedAt(createdAt, itemNew.id);
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
    await this.orderItemRepository
      .createQueryBuilder()
      .update(OrderItem)
      .set({ deleted: true })
      .where('id = :orderItemId', { id })
      .execute();
  }

  async updateStatus(
    orderItemStatus: EnumOrderItemStatus,
    orderItemId: number,
  ): Promise<void> {
    await this.orderItemRepository
      .createQueryBuilder()
      .update(OrderItem)
      .set({ orderItemStatus })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async updateQuantity(quantity: number, orderItemId: number): Promise<void> {
    await this.orderItemRepository
      .createQueryBuilder()
      .update(OrderItem)
      .set({ quantity })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async getTop5Product(): Promise<ReportProductDTO[]> {
    return this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'pd.title',
        'pd.productImage.fileFolder',
        'pd.productImage.fileName',
        'oi.size',
        'SUM(oi.quantity) as totalQuantity',
        'SUM(oi.amount) as totalAmount',
      ])
      .innerJoin('oi.product', 'pd')
      .groupBy('oi.product.id')
      .addGroupBy('oi.size')
      .orderBy('SUM(oi.quantity)', 'DESC')
      .limit(5)
      .getMany();
  }

  async updateAmount(amount: number, orderItemId: number): Promise<void> {
    await this.orderItemRepository
      .createQueryBuilder()
      .update(OrderItem)
      .set({ amount })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async updateCreatedAt(createdAt: Date, orderItemId: number): Promise<void> {
    await this.orderItemRepository
      .createQueryBuilder()
      .update(OrderItem)
      .set({ createdAt })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async getAllByOrderIdAndStatus(
    orderId: number,
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<OrderItemDTO[]> {
    return await this.orderItemRepository
      .createQueryBuilder('oi')
      .select([
        'oi.id',
        'oi.size',
        'oi.price',
        'oi.quantity',
        'oi.quantityDelivery',
        'oi.amount',
        'oi.note',
        'oi.tableId',
        'oi.product',
        'oi.order',
        'oi.orderItemStatus',
      ])
      .where('oi.deleted = :deleted', { deleted: false })
      .andWhere('oi.order.id = :orderId', { orderId })
      .andWhere('oi.orderItemStatus = :orderItemStatus', { orderItemStatus })
      .getRawMany<OrderItemDTO>();
  }
}
