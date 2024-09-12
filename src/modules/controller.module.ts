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
    // api
    CategoryAPIController,
    ProductController,
  ],
})
export class ControllerModule {}
