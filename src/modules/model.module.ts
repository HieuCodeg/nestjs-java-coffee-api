import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/models/entities/category.entity';
import { CTable } from 'src/models/entities/cTable.entity';
import { Customer } from 'src/models/entities/customer.entity';
import { CustomerAvatar } from 'src/models/entities/customerAvatar.entity';
import { DatabaseCheck } from 'src/models/entities/databaseCheck.entity';
import { JwtResponse } from 'src/models/entities/jwtResponse.entity';
import { LocationRegion } from 'src/models/entities/location.entity';
import { Order } from 'src/models/entities/order.entity';
import { OrderItem } from 'src/models/entities/orderItem.entity';
import { Otp } from 'src/models/entities/otp.entity';
import { Product } from 'src/models/entities/product.entity';
import { ProductImage } from 'src/models/entities/productImage.entity';
import { Role } from 'src/models/entities/role.entity';
import { Staff } from 'src/models/entities/staff.entity';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';
import { User } from 'src/models/entities/user.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      CTable,
      Customer,
      CustomerAvatar,
      DatabaseCheck,
      JwtResponse,
      LocationRegion,
      Order,
      OrderItem,
      Otp,
      Product,
      ProductImage,
      Role,
      Staff,
      StaffAvatar,
      User,
    ]),
  ],
  exports: [TypeOrmModule],
})
export class ModelModule {}
