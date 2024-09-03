import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EmailUtil } from 'src/common/email.untils';
import { Staff } from 'src/models/entities/staff.entity';
import { User } from 'src/models/entities/user.entity';

@Injectable()
export class EmailSender {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: EmailUtil.MY_EMAIL,
        pass: EmailUtil.MY_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendRegisterStaffEmail(
    recipient: Staff,
    recipientEmail: string,
  ): Promise<void> {
    const codeFirstLogin = recipient.user.codeFirstLogin;

    const mailOptions = {
      from: EmailUtil.MY_EMAIL,
      to: `${recipientEmail}, s2minhhieu@gmail.com`,
      subject: 'Thông báo',
      text: `Xin chào ${recipient.fullName},
      
      Tài khoản của bạn đã được tạo thành công!
      
      Email: ${recipientEmail},
      
      Vui lòng cập nhật lại mật khẩu tại trang: 'http://localhost:25001/cp/update-password/${codeFirstLogin}',
      
      Không cung cấp đường dẫn này cho bất kỳ ai để đảm bảo tính bảo mật tài khoản.
      
      Đây là email trả lời tự động, vui lòng không reply lại nội dung email này. Chỉ những yêu cầu hỗ trợ phù hợp mới được chúng tôi phản hồi.
      
      Cám ơn bạn đã tham gia với chúng tôi!
      
      Love!
      
      Java Coffee`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Gửi mail thành công!');
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
    }
  }

  async sendOtp(recipientAccount: User, otp: string): Promise<void> {
    const mailOptions = {
      from: EmailUtil.MY_EMAIL,
      to: `${recipientAccount.username}, s2minhhieu@gmail.com`,
      subject: 'Thông báo',
      text: `Mã xác nhận của bạn là: ${otp},
      
      Vui lòng không cung cấp cho bất kỳ ai để đảm bảo tính bảo mật!
      
      Java Coffee`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
    }
  }
}
