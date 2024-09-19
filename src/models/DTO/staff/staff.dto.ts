import { Expose, Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { AppUtils } from 'src/common/app.untils';
import { Staff } from 'src/models/entities/staff.entity';
import { EnumGender } from 'src/models/enums/enumGender';
import { LocationRegionDTO } from '../locationRegion/location.dto';
import { StaffAvatarDTO } from '../staffAvatar/staffAvatar.dto';
import { UserDTO } from '../user/user.dto';

export class StaffDTO {
  @Expose()
  @IsOptional()
  id?: number; // Java Long tương ứng với TypeScript number

  @Expose()
  @IsString({ message: 'Vui lòng nhập tên nhân viên!' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên nhân viên!' })
  @Matches(/^.{5,100}$/, {
    message: 'Họ tên có độ dài nằm trong khoảng 5 - 100 ký tự.',
  })
  fullName: string;

  @Expose()
  @IsString({ message: 'Vui lòng nhập ngày tháng năm sinh!' })
  @IsNotEmpty({ message: 'Vui lòng nhập ngày tháng năm sinh!' })
  dob: string;

  @Expose()
  @IsString({ message: 'Vui lòng chọn giới tính!' })
  @IsNotEmpty({ message: 'Vui lòng chọn giới tính!' })
  gender: string;

  @Expose()
  @IsString({ message: 'Vui lòng nhập số điện thoại.' })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại.' })
  @Matches(/^0[1-9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng.',
  })
  phone: string;

  @Expose()
  @ValidateNested()
  @Type(() => LocationRegionDTO)
  locationRegion: LocationRegionDTO;

  @Expose()
  @ValidateNested()
  @Type(() => UserDTO)
  user: UserDTO;

  @Expose()
  @ValidateNested()
  @Type(() => StaffAvatarDTO)
  @Transform(({ obj }) => obj.avatar)
  staffAvatar: StaffAvatarDTO;

  // Convert DTO to entity if needed
  toStaff(): Staff {
    const staff = new Staff();
    staff.id = this.id;
    staff.fullName = this.fullName;
    staff.phone = this.phone;
    staff.dob = AppUtils.stringToLocalDate(this.dob); // Assuming dob is a date string
    staff.gender = this.gender as EnumGender;
    staff.locationRegion = this.locationRegion
      ? this.locationRegion.toLocationRegion()
      : null;
    staff.user = this.user ? this.user.toUser() : null;
    staff.avatar = this.staffAvatar ? this.staffAvatar.toStaffAvatar() : null;
    return staff;
  }
}
