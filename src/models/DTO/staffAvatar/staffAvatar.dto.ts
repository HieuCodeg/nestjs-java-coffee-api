import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';

export class StaffAvatarDTO {
  @Expose()
  @IsOptional()
  @IsString()
  id?: string;

  @Expose()
  @IsOptional()
  @IsString()
  fileName?: string;

  @Expose()
  @IsOptional()
  @IsString()
  fileFolder?: string;

  @Expose()
  @IsNotEmpty({ message: 'Vui lòng chọn hình ảnh' })
  @IsString()
  fileUrl: string;

  @Expose()
  @IsOptional()
  @IsString()
  fileType?: string;

  @Expose()
  @IsOptional()
  @IsString()
  cloudId?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  ts?: number;

  toStaffAvatar(): StaffAvatar {
    const staffAvatar = new StaffAvatar();
    staffAvatar.id = this.id;
    staffAvatar.fileName = this.fileName;
    staffAvatar.fileFolder = this.fileFolder;
    staffAvatar.fileUrl = this.fileUrl;
    staffAvatar.fileType = this.fileType;
    staffAvatar.cloudId = this.cloudId;
    staffAvatar.ts = this.ts;
    return staffAvatar;
  }
}
