import { Injectable } from '@nestjs/common';
import { OrderItemDTO } from 'src/models/DTO/orderItem/orderItem.dto';
import { OrderItemKitchenDTO } from 'src/models/DTO/orderItem/orderItemKitchen.dto';
import { OrderItemKitchenTableDTO } from 'src/models/DTO/orderItem/orderItemKitchenTable.dto';
import { OrderItemResponseDTO } from 'src/models/DTO/orderItem/orderItemResponse.dto';
import { ReportProductDTO } from 'src/models/DTO/report/reportProduct.dto';
import { OrderItem } from 'src/models/entities/orderItem.entity';
import { EnumOrderItemStatus } from 'src/models/enums/enumOrderItemStatus';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class OrderItemRepository extends Repository<OrderItem> {
  async getAllByOrderIdAndStatus(
    orderId: number,
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<OrderItemDTO[]> {
    return await this.createQueryBuilder('oi')
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

  async getOrderItemDTOByOrderId(orderId: number): Promise<OrderItemDTO[]> {
    return await this.createQueryBuilder('oi')
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

  async getOrderItemDTOByOrderIdAndStatus(
    orderId: number,
    orderItemStatus: EnumOrderItemStatus,
  ): Promise<OrderItemDTO[]> {
    return await this.createQueryBuilder('oi')
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

  async getOrderItemByProductAndSizeAndStatus(
    orderItemStatus: EnumOrderItemStatus,
    productId: number,
    size: string,
  ): Promise<OrderItemDTO[]> {
    return await this.createQueryBuilder('oi')
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
    return await this.createQueryBuilder('oi')
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
    return await this.createQueryBuilder('oi')
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
    return await this.createQueryBuilder('oi')
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
  ): Promise<OrderItemKitchenDTO[]> {
    return await this.createQueryBuilder('oi')
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
  ): Promise<OrderItemKitchenDTO[]> {
    return await this.createQueryBuilder('oi')
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
  ): Promise<OrderItemKitchenTableDTO[]> {
    return await this.createQueryBuilder('oi')
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

  async updateStatus(
    orderItemStatus: EnumOrderItemStatus,
    orderItemId: number,
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(OrderItem)
      .set({ orderItemStatus })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async updateQuantity(quantity: number, orderItemId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(OrderItem)
      .set({ quantity })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async updateCreatedAt(createdAt: Date, orderItemId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(OrderItem)
      .set({ createdAt })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async updateAmount(amount: number, orderItemId: number): Promise<void> {
    await this.createQueryBuilder()
      .update(OrderItem)
      .set({ amount })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async softDelete(orderItemId: number): Promise<UpdateResult> {
    return await this.createQueryBuilder()
      .update(OrderItem)
      .set({ deleted: true })
      .where('id = :orderItemId', { orderItemId })
      .execute();
  }

  async getTop5Product(): Promise<ReportProductDTO[]> {
    return await this.createQueryBuilder('oi')
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
}
