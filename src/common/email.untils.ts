import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailUtil {
  public readonly MY_EMAIL: string;
  public readonly MY_PASSWORD: string;

  public readonly MAIL_SMTP_HOST: string;
  public readonly MAIL_SMTP_PORT: string;

  public readonly MAIL_SMTP_AUTH: string;
  public readonly MAIL_SMTP_STARTTLS_ENABLE: string;

  constructor(private configService: ConfigService) {
    this.MY_EMAIL = this.configService.get<string>('MY_EMAIL');
    this.MY_PASSWORD = this.configService.get<string>('MY_PASSWORD');

    this.MAIL_SMTP_HOST = this.configService.get<string>(
      'MAIL_SMTP_HOST',
      'smtp.gmail.com',
    );
    this.MAIL_SMTP_PORT = this.configService.get<string>(
      'MAIL_SMTP_PORT',
      '587',
    );

    this.MAIL_SMTP_AUTH = this.configService.get<string>(
      'MAIL_SMTP_AUTH',
      'true',
    );
    this.MAIL_SMTP_STARTTLS_ENABLE = this.configService.get<string>(
      'MAIL_SMTP_STARTTLS_ENABLE',
      'true',
    );
  }
}
