import { Module } from '@nestjs/common';
import { AuthController } from 'src/controllers/api/auth.controller';
import { CPController } from 'src/controllers/web/cp.controller';
import { HomeController } from 'src/controllers/web/home.controller';
import { ServiceModule } from './service.module';
import { UntilModule } from './until.module';
import { CategoryCPController } from 'src/controllers/web/category-cp.controller';
import { CustomerCPController } from 'src/controllers/web/customer-cp.controller';
import { OrderCPController } from 'src/controllers/web/order-cp.controller';
import { ProductCPController } from 'src/controllers/web/product-cp.controller';
import { ReportCPController } from 'src/controllers/web/report-cp.controller';
import { StaffCPController } from 'src/controllers/web/staff-cp.controller';
import { TableCPController } from 'src/controllers/web/table-cp.controller';
import { CategoryAPIController } from 'src/controllers/api/category-api.controller';
import { ProductController } from 'src/controllers/api/product-api.controller';
import { TableController } from 'src/controllers/api/table-api.controller';
import { StaffController } from 'src/controllers/api/staff-api.controller';
import { RoleAPI } from 'src/controllers/api/role-api.controller';
import { UserController } from 'src/controllers/api/user-api.controller';
import { CashierController } from 'src/controllers/api/cashier-api.controller';
import { DatabaseCheckController } from 'src/controllers/api/databasecheck-api.controller';
import { OrderController } from 'src/controllers/api/order-api.controller';
import { OrderItemController } from 'src/controllers/api/oderItem-api.controller';
import { OtpController } from 'src/controllers/api/otp-api.controller';
import { ReportController } from 'src/controllers/api/report-api.controller';
import { HandleErrorController } from 'src/controllers/web/handle-error.controller';

@Module({
  imports: [ServiceModule, UntilModule],
  controllers: [
    HomeController,
    CPController,
    AuthController,
    CategoryCPController,
    CustomerCPController,
    OrderCPController,
    ProductCPController,
    ReportCPController,
    StaffCPController,
    TableCPController,
    HandleErrorController,
    // api
    CategoryAPIController,
    ProductController,
    TableController,
    StaffController,
    RoleAPI,
    UserController,
    CashierController,
    DatabaseCheckController,
    OrderController,
    OrderItemController,
    OtpController,
    ReportController,
  ],
})
export class ControllerModule {}
