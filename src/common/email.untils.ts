import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailUtil {
  public static readonly MY_EMAIL: string = process.env.MY_EMAIL;
  public static readonly MY_PASSWORD: string = process.env.MY_PASSWORD;

  public static readonly MAIL_SMTP_HOST: string =
    process.env.MAIL_SMTP_HOST || 'smtp.gmail.com';
  public static readonly MAIL_SMTP_PORT: string =
    process.env.MAIL_SMTP_PORT || '587';

  public static readonly MAIL_SMTP_AUTH: string =
    process.env.MAIL_SMTP_AUTH || 'true';
  public static readonly MAIL_SMTP_STARTTLS_ENABLE: string =
    process.env.MAIL_SMTP_STARTTLS_ENABLE || 'true';
}
