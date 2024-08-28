import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOption } from 'db/data-source';
import { HomeController } from './controllers/web/home.controller';
import { CloudinaryModule } from './modules/cloudinary.module';
import { AdminModule } from './modules/admin.module';
import { StaffModule } from './modules/staff.module';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOption),
    CloudinaryModule,
    StaffModule,
    UserModule,
    AdminModule,
  ],
  controllers: [AppController, HomeController],
  providers: [AppService],
})
export class AppModule {}
