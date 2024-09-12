import { Expose } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ReportDayToDayDTO {
  @Expose()
  @IsOptional()
  @IsString({ message: 'Day must be a valid string.' })
  day?: string;

  @Expose()
  @IsOptional()
  @IsNumber({}, { message: 'Total amount must be a valid number.' })
  totalAmount?: number; // Sử dụng number để đại diện cho BigDecimal

  constructor(day?: string, totalAmount?: number) {
    this.day = day;
    this.totalAmount = totalAmount;
  }
}
