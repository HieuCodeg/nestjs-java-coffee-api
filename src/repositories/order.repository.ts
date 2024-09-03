import { Injectable } from '@nestjs/common';
import { OrderDTO } from 'src/models/DTO/order/order.dto';
import { OrderCountCurrentMonthDTO } from 'src/models/DTO/order/orderCountCurrentMonth.dto';
import { ReportDTO } from 'src/models/DTO/report/report.dto';
import { ReportDayToDayDTO } from 'src/models/DTO/report/reportDayToDay.dto';
import { ReportYearDTO } from 'src/models/DTO/report/reportYear.dto';
import { Order } from 'src/models/entities/order.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class OrderRepository extends Repository<Order> {
  async getAllOrderDTOWhereDeletedIsFalse(): Promise<OrderDTO[]> {
    return this.createQueryBuilder('od')
      .select([
        'od.id',
        'od.totalAmount',
        'od.orderStatus',
        'od.table',
        'od.staff',
        'od.createdAt',
      ])
      .where('od.deleted = :deleted', { deleted: false })
      .getRawMany<OrderDTO>();
  }

  async getAllOrderDTOByDayToDay(
    startDay: string,
    endDay: string,
  ): Promise<OrderDTO[]> {
    return this.createQueryBuilder('od')
      .select([
        'od.id',
        'od.totalAmount',
        'od.orderStatus',
        'od.table',
        'od.staff',
        'od.createdAt',
      ])
      .where('od.deleted = :deleted', { deleted: false })
      .andWhere("DATE_FORMAT(od.createdAt,'%Y-%m-%d') > :startDay", {
        startDay,
      })
      .andWhere("DATE_FORMAT(od.createdAt,'%Y-%m-%d') < :endDay", { endDay })
      .getRawMany<OrderDTO>();
  }

  async getOrderDTOByStatus(orderStatus: string): Promise<OrderDTO[]> {
    return this.createQueryBuilder('od')
      .select([
        'od.id',
        'od.totalAmount',
        'od.orderStatus',
        'od.table',
        'od.staff',
        'od.createdAt',
      ])
      .where('od.deleted = :deleted', { deleted: false })
      .andWhere('od.orderStatus = :orderStatus', { orderStatus })
      .getRawMany<OrderDTO>();
  }

  async getOrderDTOByTableIdAndOrderStatus(
    tableId: number,
    orderStatus: string,
  ): Promise<OrderDTO[]> {
    return this.createQueryBuilder('od')
      .select([
        'od.id',
        'od.totalAmount',
        'od.orderStatus',
        'od.table',
        'od.staff',
      ])
      .where('od.deleted = :deleted', { deleted: false })
      .andWhere('od.table.id = :tableId', { tableId })
      .andWhere('od.orderStatus = :orderStatus', { orderStatus })
      .getRawMany<OrderDTO>();
  }

  async getReportByMonth(
    month: number,
    year: number,
  ): Promise<ReportYearDTO[]> {
    return this.createQueryBuilder('od')
      .select([
        'MONTH(od.createdAt) AS month',
        'SUM(od.totalAmount) AS totalAmount',
      ])
      .where('MONTH(od.createdAt) = :month', { month })
      .andWhere('YEAR(od.createdAt) = :year', { year })
      .groupBy('MONTH(od.createdAt)')
      .getRawMany<ReportYearDTO>();
  }

  async getReportByYear(year: number): Promise<ReportYearDTO[]> {
    return this.createQueryBuilder('od')
      .select([
        'MONTH(od.createdAt) AS month',
        'SUM(od.totalAmount) AS totalAmount',
      ])
      .where('YEAR(od.createdAt) = :year', { year })
      .andWhere('od.orderStatus = :orderStatus', { orderStatus: 'PAID' })
      .groupBy('MONTH(od.createdAt)')
      .orderBy('MONTH(od.createdAt)', 'ASC')
      .getRawMany<ReportYearDTO>();
  }

  async getReportOfDay(day: string): Promise<ReportDTO[]> {
    return this.createQueryBuilder('od')
      .select(['SUM(od.totalAmount) AS totalAmount'])
      .where("DATE_FORMAT(od.createdAt,'%Y-%m-%d') = :day", { day })
      .andWhere('od.orderStatus = :orderStatus', { orderStatus: 'PAID' })
      .getRawMany<ReportDTO>();
  }

  async getReportFromDayToDay(
    startDay: string,
    endDay: string,
  ): Promise<ReportDayToDayDTO[]> {
    return this.createQueryBuilder('od')
      .select([
        "DATE_FORMAT(od.createdAt,'%d/%m/%Y') AS date",
        'SUM(od.totalAmount) AS totalAmount',
      ])
      .where("DATE_FORMAT(od.createdAt,'%Y-%m-%d') > :startDay", { startDay })
      .andWhere("DATE_FORMAT(od.createdAt,'%Y-%m-%d') < :endDay", { endDay })
      .andWhere('od.orderStatus = :orderStatus', { orderStatus: 'PAID' })
      .groupBy("DATE_FORMAT(od.createdAt,'%d/%m/%Y')")
      .orderBy("DATE_FORMAT(od.createdAt,'%d/%m/%Y')")
      .getRawMany<ReportDayToDayDTO>();
  }

  async countOrderOfCurrentDay(): Promise<OrderCountCurrentMonthDTO[]> {
    return this.createQueryBuilder('od')
      .select(['COUNT(od.id) AS orderCount'])
      .where("DATE(Date_Format(od.createdAt,'%Y/%m/%d')) = CURRENT_DATE()")
      .getRawMany<OrderCountCurrentMonthDTO>();
  }

  async getReportOfCurrentMonth(): Promise<ReportDTO[]> {
    return this.createQueryBuilder('od')
      .select(['SUM(od.totalAmount) AS totalAmount'])
      .where(
        "MONTH(Date_Format(od.createdAt,'%Y/%m/%d')) = MONTH(CURRENT_DATE())",
      )
      .andWhere(
        "YEAR(Date_Format(od.createdAt,'%Y/%m/%d')) = YEAR(CURRENT_DATE())",
      )
      .andWhere('od.orderStatus = :orderStatus', { orderStatus: 'PAID' })
      .getRawMany<ReportDTO>();
  }

  async softDelete(orderId: number): Promise<UpdateResult> {
    return await this.createQueryBuilder()
      .update(Order)
      .set({ deleted: true })
      .where('id = :orderId', { orderId })
      .execute();
  }
}
