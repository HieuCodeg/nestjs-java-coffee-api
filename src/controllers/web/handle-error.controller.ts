import { Controller, Get, Render } from '@nestjs/common';

@Controller('error')
export class HandleErrorController {
  @Get('/400')
  @Render('error/400')
  badRequest() {
    return {};
  }

  @Get('/401')
  @Render('error/401')
  unauthorized() {
    return {};
  }

  @Get('/403')
  @Render('error/403')
  accessDenied() {
    return {};
  }

  @Get('/404')
  @Render('error/404')
  resourceNotFound() {
    return {};
  }

  @Get('/405')
  @Render('error/405')
  methodNotAllowed() {
    return {};
  }

  @Get('/409')
  @Render('error/409')
  dataConflict() {
    return {};
  }

  @Get('/500')
  @Render('error/500')
  internalServerError() {
    return {};
  }
}
