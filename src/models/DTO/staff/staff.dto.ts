import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Staff } from 'src/models/entities/staff.entity';
import { LocationRegionDTO } from '../locationRegion/location.dto';
import { UserDTO } from '../user/user.dto';
import { StaffAvatarDTO } from '../staffAvatar/staffAvatar.dto';
import { AppUtils } from 'src/common/app.untils';
import { EnumGender } from 'src/models/enums/enumGender';
import { LocationRegion } from 'src/models/entities/location.entity';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';

export class StaffDTO {
  @IsOptional()
  id?: number; // Java Long tương ứng với TypeScript number

  @IsString({ message: 'Vui lòng nhập tên nhân viên!' })
  @IsNotEmpty({ message: 'Vui lòng nhập tên nhân viên!' })
  @Matches(/^.{5,100}$/, {
    message: 'Họ tên có độ dài nằm trong khoảng 5 - 100 ký tự.',
  })
  fullName: string;

  @IsString({ message: 'Vui lòng nhập ngày tháng năm sinh!' })
  @IsNotEmpty({ message: 'Vui lòng nhập ngày tháng năm sinh!' })
  dob: string;

  @IsString({ message: 'Vui lòng chọn giới tính!' })
  @IsNotEmpty({ message: 'Vui lòng chọn giới tính!' })
  gender: string;

  @IsString({ message: 'Vui lòng nhập số điện thoại.' })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại.' })
  @Matches(/^0[1-9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng.',
  })
  phone: string;

  @ValidateNested()
  @Type(() => LocationRegionDTO)
  locationRegion: LocationRegionDTO;

  @ValidateNested()
  @Type(() => UserDTO)
  user: UserDTO;

  @ValidateNested()
  @Type(() => StaffAvatarDTO)
  staffAvatar: StaffAvatarDTO;

  constructor(
    id?: number,
    fullName?: string,
    phone?: string,
    dob?: Date,
    gender?: EnumGender,
    locationRegion?: LocationRegion,
    user?: UserDTO,
    staffAvatar?: StaffAvatar,
  ) {
    this.id = id;
    this.fullName = fullName;
    this.phone = phone;
    this.dob = AppUtils.localDateToString(dob);
    this.gender = gender?.toString();
    this.locationRegion = locationRegion.toLocationRegionDTO();
    this.user = user;
    this.staffAvatar = staffAvatar.toStaffAvatarDTO();
  }

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
