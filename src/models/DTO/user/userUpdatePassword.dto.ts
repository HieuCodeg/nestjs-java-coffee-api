import {
  IsNotEmpty,
  IsString,
  Matches,
  Length,
  IsOptional,
} from 'class-validator';

export class UserUpdatePasswordDTO {
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Mật khẩu không đúng định dạng (Mật khẩu gồm 1 ít nhất ký tự hoa, thường, số, ký tự đặc biệt).',
  })
  @Length(8, 50, {
    message: 'Mật khẩu có độ dài nằm trong khoảng 8 - 50 ký tự.',
  })
  password: string;

  @IsNotEmpty({ message: 'Vui lòng nhập lại mật khẩu.' })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'Mật khẩu không đúng định dạng (Mật khẩu gồm 1 ít nhất ký tự hoa, thường, số, ký tự đặc biệt).',
  })
  @Length(8, 50, {
    message: 'Mật khẩu có độ dài nằm trong khoảng 8 - 50 ký tự.',
  })
  passwordConfirm: string;

  @IsOptional()
  @IsString()
  codeFirstLogin?: string;
}
