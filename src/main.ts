import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { NotFoundExceptionFilter } from './filters/not-found-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('ejs');
  app.use(cookieParser());
  app.useGlobalFilters(new NotFoundExceptionFilter());
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, // Để cho phép gửi cookie
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type, Authorization', // Các header được phép
  });
  // app.enableCors({
  //   origin: true, // Cho phép tất cả các site
  //   credentials: true, // Cho phép gửi cookie (nếu cần)
  // });
  await app.listen(3000);
}
bootstrap();
