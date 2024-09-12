import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { OrderItemKitchenDTO } from '../orderItem/orderItemKitchen.dto';

export class OrderKitChenResponseDTO {
  @Expose()
  @IsArray({ message: 'Order ID change list phải là một mảng.' })
  @IsNumber(
    {},
    {
      each: true,
      message: 'Các phần tử trong order ID change list phải là số.',
    },
  )
  orderIdChangeList: number[];

  @Expose()
  @IsArray({ message: 'Order item response list phải là một mảng.' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemKitchenDTO)
  orderItemResponseList: OrderItemKitchenDTO[];
}
