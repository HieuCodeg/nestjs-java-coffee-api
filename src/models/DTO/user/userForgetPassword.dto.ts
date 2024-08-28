import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';

export class UserForgetPasswordDTO {
  @IsNotEmpty({ message: 'Vui lòng nhập email.' })
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  username: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới.' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Mật khẩu không đúng định dạng (Mật khẩu gồm 1 ít nhất ký tự hoa, thường, số, ký tự đặc biệt).',
  })
  @Length(8, 50, {
    message: 'Mật khẩu có độ dài nằm trong khoảng 8 - 50 ký tự.',
  })
  password: string;

  @IsNotEmpty({ message: 'Vui lòng nhập lại mật khẩu mới.' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Mật khẩu không đúng định dạng (Mật khẩu gồm 1 ít nhất ký tự hoa, thường, số, ký tự đặc biệt).',
  })
  @Length(8, 50, {
    message: 'Mật khẩu có độ dài nằm trong khoảng 8 - 50 ký tự.',
  })
  passwordConfirm: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mã OTP.' })
  @Length(6, 6, { message: 'Mã OTP bao gồm 6 ký tự.' })
  otp: string;
}
