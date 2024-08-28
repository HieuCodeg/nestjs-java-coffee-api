import { IsInt, IsNumber, IsOptional, Max, Min } from 'class-validator';

export class ReportYearDTO {
  @IsOptional()
  @IsInt({ message: 'Month must be an integer.' })
  @Min(1, { message: 'Month must be at least 1.' })
  @Max(12, { message: 'Month must be at most 12.' })
  month?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Total amount must be a valid number.' })
  totalAmount?: number; // Sử dụng number hoặc Decimal

  constructor(month?: number, totalAmount?: number) {
    this.month = month;
    this.totalAmount = totalAmount;
  }
}
