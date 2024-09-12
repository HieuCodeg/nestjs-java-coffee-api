import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOption } from 'db/data-source';
import { AppController } from './app.controller';
import { HomeController } from './controllers/web/home.controller';
import { CloudinaryModule } from './modules/cloudinary.module';
import { ControllerModule } from './modules/controller.module';
import { UntilModule } from './modules/until.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOption),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CloudinaryModule,
    UntilModule,
    ControllerModule,
  ],
  controllers: [AppController, HomeController],
  providers: [],
})
export class AppModule {}
