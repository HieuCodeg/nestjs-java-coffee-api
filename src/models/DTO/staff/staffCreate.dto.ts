import { Expose } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsEmail,
} from 'class-validator';
import { LocationRegion } from 'src/models/entities/location.entity';
import { Role } from 'src/models/entities/role.entity';
import { Staff } from 'src/models/entities/staff.entity';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';
import { User } from 'src/models/entities/user.entity';
import { EnumGender } from 'src/models/enums/enumGender';
import { Column } from 'typeorm';

export class StaffCreateDTO {
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
  @IsString({ message: 'Ngày sinh không đúng định dạng.' })
  @IsNotEmpty({ message: 'Vui lòng nhập ngày tháng năm sinh!' })
  @Matches(/^\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/, {
    message: 'Ngày sinh không đúng định dạng.',
  })
  dob: string;

  @Expose()
  @IsString({ message: 'Vui lòng chọn giới tính!' })
  @IsNotEmpty({ message: 'Vui lòng chọn giới tính!' })
  gender: string;

  @Expose()
  @IsString({ message: 'Vui lòng nhập số điện thoại!' })
  @IsNotEmpty({ message: 'Vui lòng nhập số điện thoại!' })
  @Matches(/^0[1-9][0-9]{8}$/, {
    message: 'Số điện thoại không đúng định dạng.',
  })
  @Column({ unique: true })
  phone: string;

  @Expose()
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  @IsNotEmpty({ message: 'Vui lòng nhập email!' })
  username: string;

  @Expose()
  @IsString()
  @IsOptional()
  password?: string;

  @Expose()
  @IsString({ message: 'ID role phải là số.' })
  @IsNotEmpty({ message: 'ID role không được trống.' })
  @Matches(/^\d+$/, { message: 'ID role phải là số.' })
  roleId: string;

  @Expose()
  @IsString({ message: 'ID Tỉnh/Thành phố phải là số.' })
  @IsNotEmpty({ message: 'ID Tỉnh/Thành phố không được trống.' })
  @Matches(/^\d+$/, { message: 'ID Tỉnh/Thành phố phải là số.' })
  provinceId: string;

  @Expose()
  @IsString({ message: 'Tên Tỉnh/Thành phố không được trống.' })
  @IsNotEmpty({ message: 'Tên Tỉnh/Thành phố không được trống.' })
  provinceName: string;

  @Expose()
  @IsString({ message: 'ID Thành phố/Quận/Huyện phải là số.' })
  @IsNotEmpty({ message: 'ID Thành phố/Quận/Huyện không được trống.' })
  @Matches(/^\d+$/, { message: 'ID Thành phố/Quận/Huyện phải là số.' })
  districtId: string;

  @Expose()
  @IsString({ message: 'Tên Thành phố/Quận/Huyện không được trống.' })
  @IsNotEmpty({ message: 'Tên Thành phố/Quận/Huyện không được trống.' })
  districtName: string;

  @Expose()
  @IsString({ message: 'ID Phường/Xã/Thị trấn phải là số.' })
  @IsNotEmpty({ message: 'ID Phường/Xã/Thị trấn không được trống.' })
  @Matches(/^\d+$/, { message: 'ID Phường/Xã/Thị trấn phải là số.' })
  wardId: string;

  @Expose()
  @IsString({ message: 'Tên Phường/Xã/Thị trấn không được trống.' })
  @IsNotEmpty({ message: 'Tên Phường/Xã/Thị trấn không được trống.' })
  wardName: string;

  @Expose()
  @IsString({ message: 'Vui lòng nhập địa chỉ' })
  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ' })
  @Matches(/^.{5,100}$/, {
    message: 'Địa chỉ có độ dài nằm trong khoảng 5 - 100 ký tự.',
  })
  address: string;

  // Convert DTO to entity if needed
  toUser(role: Role): User {
    const user = new User();
    user.id = this.id;
    user.username = this.username;
    user.password = this.password;
    user.role = role;
    return user;
  }

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
    staff.phone = this.phone;
    staff.dob = new Date(this.dob); // Assuming dob is a date string
    staff.gender = this.gender as EnumGender;
    staff.user = user;
    staff.locationRegion = locationRegion;
    staff.avatar = staffAvatar;
    return staff;
  }
}
