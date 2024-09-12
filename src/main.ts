import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(resolve('./public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('ejs');
  app.use(cookieParser());
  await app.listen(3000);
}
bootstrap();
