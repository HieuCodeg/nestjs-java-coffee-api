import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';
import Decimal from 'decimal.js';

export class ReportDTO {
  @Expose()
  @IsOptional()
  totalAmount?: Decimal; // Sử dụng Decimal để đại diện cho BigDecimal

  constructor(totalAmount?: Decimal) {
    this.totalAmount = totalAmount;
  }
}
