import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import * as dayjs from 'dayjs';
import * as crypto from 'crypto';
import { User } from 'src/models/entities/user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class AppUtils {
  private static readonly stringAB =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  private static readonly DATE_PATTERN = 'YYYY-MM-DD';

  mapErrorToResponse(errors: any): any {
    const errorMessages = {};
    errors.forEach((error) => {
      errorMessages[error.property] = Object.values(error.constraints).join(
        ', ',
      );
    });
    throw new BadRequestException(errorMessages);
  }

  static stringToLocalDate(str: string): Date {
    return dayjs(str, this.DATE_PATTERN).toDate();
  }

  static localDateToString(date: Date): string {
    return dayjs(date).format(this.DATE_PATTERN);
  }

  getUserName(request: RequestWithUser): string {
    const user = request.user;
    return user ? user.username : 'Anonymous';
  }

  randomPassword(length: number): string {
    return this.generateRandomString(length);
  }

  randomOtp(length: number): string {
    return this.generateRandomString(length);
  }

  private generateRandomString(length: number): string {
    const stringBuilder = [];
    for (let i = 0; i < length; i++) {
      stringBuilder.push(
        AppUtils.stringAB.charAt(crypto.randomInt(AppUtils.stringAB.length)),
      );
    }
    return stringBuilder.join('');
  }

  checkPrice(price: number): string {
    if (price < 10000) return 'Giá sản phẩm ít nhất là 10.000 VNĐ.';
    if (price > 500000) return 'Giá sản phẩm lớn nhất là 500.000 VNĐ.';
    if (price % 1000 !== 0) return 'Giá sản phẩm phải chia hết cho 1.000.';
    return '';
  }
}
