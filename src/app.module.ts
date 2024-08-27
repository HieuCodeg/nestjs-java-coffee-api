import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user.module';
import { dataSourceOption } from 'db/data-source';
import { HomeController } from './controllers/web/home.controller';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOption), UserModule],
  controllers: [AppController, HomeController],
  providers: [AppService],
})
export class AppModule {}
