import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { AppUtils } from 'src/common/app.untils';
import { UserUpdatePasswordDTO } from 'src/models/DTO/user/userUpdatePassword.dto';
import { UserService } from 'src/services/user.service';

@Controller('/api/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly appUtils: AppUtils,
  ) {}

  @Post('/update-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updatePassword(
    @Body() userUpdatePasswordDTO: UserUpdatePasswordDTO,
    @Res() res: Response,
  ) {
    console.log('da vao day');

    const user = await this.userService.findByCodeFirstLogin(
      userUpdatePasswordDTO.codeFirstLogin,
    );

    if (!user) {
      throw new BadRequestException('Người dùng không hợp lệ.');
    }

    if (!user.isFirstLogin) {
      throw new BadRequestException('Người dùng không hợp lệ.');
    }

    if (user.deleted) {
      throw new BadRequestException('Tài khoản của bạn đã bị khóa!');
    }

    const { password, passwordConfirm } = userUpdatePasswordDTO;

    if (password !== passwordConfirm) {
      throw new BadRequestException(
        'Mật khẩu không trùng nhau. Vui lòng nhập lại!',
      );
    }

    user.password = password;
    user.isFirstLogin = false;
    user.codeFirstLogin = '0';

    await this.userService.save(user);

    return res.status(HttpStatus.OK).send();
  }
}
