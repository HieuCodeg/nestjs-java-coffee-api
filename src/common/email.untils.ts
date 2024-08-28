import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailUtilService {
  public readonly MY_EMAIL: string = process.env.MY_EMAIL;
  public readonly MY_PASSWORD: string = process.env.MY_PASSWORD;

  public readonly MAIL_SMTP_HOST: string =
    process.env.MAIL_SMTP_HOST || 'smtp.gmail.com';
  public readonly MAIL_SMTP_PORT: string = process.env.MAIL_SMTP_PORT || '587';

  public readonly MAIL_SMTP_AUTH: string = process.env.MAIL_SMTP_AUTH || 'true';
  public readonly MAIL_SMTP_STARTTLS_ENABLE: string =
    process.env.MAIL_SMTP_STARTTLS_ENABLE || 'true';
}
