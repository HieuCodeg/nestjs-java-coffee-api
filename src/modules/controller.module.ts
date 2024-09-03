import { Module } from '@nestjs/common';
import { HomeController } from 'src/controllers/web/home.controller';
import { ServiceModule } from './service.module';
import { CPController } from 'src/controllers/web/cp.controller';
import { UntilModule } from './until.module';

@Module({
  imports: [ServiceModule, UntilModule],
  controllers: [HomeController, CPController],
})
export class ControllerModule {}
