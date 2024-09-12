import { Expose } from 'class-transformer';

export class OrderCountCurrentMonthDTO {
  @Expose()
  count: number;

  constructor(count: number) {
    this.count = count;
  }
}
