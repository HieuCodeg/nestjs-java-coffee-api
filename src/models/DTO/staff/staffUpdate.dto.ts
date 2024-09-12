import { Expose } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { AppUtils } from 'src/common/app.untils';
import { LocationRegion } from 'src/models/entities/location.entity';
import { Staff } from 'src/models/entities/staff.entity';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';
import { User } from 'src/models/entities/user.entity';
import { EnumGender } from 'src/models/enums/enumGender';

export class StaffUpdateDTO {
  @Expose()
  @IsOptional()
  id?: number;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập tên nhân viên!' })
  @Length(5, 100, {
    message: 'Họ tên có độ dài nằm trong khoảng 5 - 100 ký tự.',
  })
  fullName: string;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập ngày tháng năm sinh!' })
  @Matches(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/, {
    message: 'Ngày sinh không đúng định dạng.',
  })
  dob: string;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng chọn giới tính!' })
  @IsString()
  gender: EnumGender;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại!' })
  @Matches(/^0[1-9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng.',
  })
  phone: string;

  @Expose()
  @IsNotEmpty({ message: 'ID role không được trống.' })
  @Matches(/^\d+$/, { message: 'ID role phải là số.' })
  roleId: string;

  @Expose()
  @IsNotEmpty({ message: 'ID Tỉnh/Thành phố xã không được trống.' })
  @Matches(/^\d+$/, { message: 'ID Tỉnh/Thành phố phải là số.' })
  provinceId: string;

  @Expose()
  @IsNotEmpty({ message: 'Tên Tỉnh/Thành phố không được trống.' })
  @IsString()
  provinceName: string;

  @Expose()
  @IsNotEmpty({ message: 'ID Thành phố/Quận/Huyện xã không được trống.' })
  @Matches(/^\d+$/, { message: 'ID Thành phố/Quận/Huyện phải là số.' })
  districtId: string;

  @Expose()
  @IsNotEmpty({ message: 'Tên Thành phố/Quận/Huyện xã không được trống.' })
  @IsString()
  districtName: string;

  @Expose()
  @IsNotEmpty({ message: 'Phường/Xã/Thị trấn không được trống.' })
  @Matches(/^\d+$/, { message: 'ID Phường/Xã/Thị trấn phải là số.' })
  wardId: string;

  @Expose()
  @IsNotEmpty({ message: 'Tên Phường/Xã/Thị trấn không được trống.' })
  @IsString()
  wardName: string;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ' })
  @Length(5, 100, {
    message: 'Địa chỉ có độ dài nằm trong khoảng 5 - 100 ký tự.',
  })
  address: string;

  toLocationRegion(): LocationRegion {
    const locationRegion = new LocationRegion();
    locationRegion.id = this.id;
    locationRegion.provinceId = this.provinceId;
    locationRegion.provinceName = this.provinceName;
    locationRegion.districtId = this.districtId;
    locationRegion.districtName = this.districtName;
    locationRegion.wardId = this.wardId;
    locationRegion.wardName = this.wardName;
    locationRegion.address = this.address;
    return locationRegion;
  }

  toStaff(
    user: User,
    locationRegion: LocationRegion,
    staffAvatar: StaffAvatar,
  ): Staff {
    const staff = new Staff();
    staff.id = this.id;
    staff.fullName = this.fullName;
    staff.dob = AppUtils.stringToLocalDate(this.dob);
    staff.gender = this.gender as EnumGender;
    staff.phone = this.phone;
    staff.locationRegion = locationRegion;
    staff.user = user;
    staff.avatar = staffAvatar;
    return staff;
  }
}
