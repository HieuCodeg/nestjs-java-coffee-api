import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';

export class StaffAvatarDTO {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  fileFolder?: string;

  @IsNotEmpty({ message: 'Vui lòng chọn hình ảnh' })
  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsString()
  fileType?: string;

  @IsOptional()
  @IsString()
  cloudId?: string;

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
