import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppUtils } from 'src/common/app.untils';
import { Otp } from 'src/models/entities/otp.entity';
import { EmailSender } from 'src/services/email-sender.service';
import { OtpServiceImpl } from 'src/services/otp.service';
import { UserService } from 'src/services/user.service';

@Controller('api/otp')
export class OtpController {
  constructor(
    private readonly otpService: OtpServiceImpl,
    private readonly userService: UserService,
    private readonly emailSender: EmailSender,
    private readonly appUtils: AppUtils,
  ) {}

  @Get(':code')
  async getOtpByCode(@Param('code') code: string) {
    const otp = await this.otpService.getByCode(code);

    if (!otp) {
      throw new HttpException(
        'Mã xác nhận không đúng! Vui lòng kiểm tra lại!',
        HttpStatus.NOT_FOUND,
      );
    }

    return { statusCode: HttpStatus.OK, data: otp.toOtpDTO() };
  }

  @Post('send-otp')
  async sendOtp(@Body() email: string) {
    email = email.trim();
    if (email === '') {
      throw new HttpException('Email không hợp lệ', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.getByUsername(email);

    if (!user) {
      throw new HttpException('Email không hợp lệ', HttpStatus.BAD_REQUEST);
    }

    const otpOptional = await this.otpService.getOtpByUserId(user.id);

    if (otpOptional) {
      await this.otpService.softDelete(otpOptional.id);
    }

    const code = this.appUtils.randomOtp(6);

    let newOtp = new Otp();
    newOtp.id = null;
    newOtp.code = code;
    newOtp.user = user;

    newOtp = await this.otpService.save(newOtp);

    await this.emailSender.sendOtp(user, newOtp.code);

    return { statusCode: HttpStatus.OK, message: 'OTP đã được gửi!' };
  }
}
