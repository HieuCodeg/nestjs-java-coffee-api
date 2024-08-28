import { Module } from '@nestjs/common';
import { AppUtils } from 'src/common/app.untils';
import { CPController } from 'src/controllers/web/cp.controller';
import { StaffModule } from './staff.module';
import { UserModule } from './user.module';

@Module({
  imports: [StaffModule, UserModule],
  providers: [AppUtils],
  controllers: [CPController],
})
export class AdminModule {}
