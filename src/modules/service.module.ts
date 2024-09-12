import { Module } from '@nestjs/common';
import { AdminSeeder } from 'src/services/admin-seeder.service';
import { CategoryServiceImpl } from 'src/services/category.service';
import { CustomerAvatarServiceImpl } from 'src/services/customer-avatar.service';
import { CustomerService } from 'src/services/customer.service';
import { DatabaseCheckServiceImpl } from 'src/services/database-check.service';
import { EmailSender } from 'src/services/email-sender.service';
import { LocationRegionService } from 'src/services/location-region.service';
import { OrderItemService } from 'src/services/order-item.service';
import { OrderService } from 'src/services/order.service';
import { OtpServiceImpl } from 'src/services/otp.service';
import { ProductImageService } from 'src/services/product-image.service';
import { ProductService } from 'src/services/product.service';
import { RoleServiceImpl } from 'src/services/role.service';
import { StaffAvatarService } from 'src/services/staff-avatar.service';
import { StaffServiceImpl } from 'src/services/staff.service';
import { TableService } from 'src/services/table.service';
import { UploadServiceImpl } from 'src/services/upload.service';
import { UserService } from 'src/services/user.service';
import { CloudinaryModule } from './cloudinary.module';
import { ModelModule } from './model.module';
import { UntilModule } from './until.module';
import { AuthService } from 'src/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { JwtStrategy } from 'src/config/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ModelModule,
    UntilModule,
    CloudinaryModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  providers: [
    CategoryServiceImpl,
    CustomerAvatarServiceImpl,
    CustomerService,
    DatabaseCheckServiceImpl,
    EmailSender,
    LocationRegionService,
    OrderItemService,
    OrderService,
    OtpServiceImpl,
    ProductImageService,
    ProductService,
    RoleServiceImpl,
    StaffAvatarService,
    StaffServiceImpl,
    TableService,
    UploadServiceImpl,
    UserService,
    AdminSeeder,
    // auth
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
  ],
  exports: [
    CategoryServiceImpl,
    CustomerAvatarServiceImpl,
    CustomerService,
    DatabaseCheckServiceImpl,
    EmailSender,
    LocationRegionService,
    OrderItemService,
    OrderService,
    OtpServiceImpl,
    ProductImageService,
    ProductService,
    RoleServiceImpl,
    StaffAvatarService,
    StaffServiceImpl,
    TableService,
    UploadServiceImpl,
    UserService,
    AdminSeeder,
    // auth
    JwtModule,
    AuthService,
    JwtAuthGuard,
    JwtStrategy,
  ],
})
export class ServiceModule {}
