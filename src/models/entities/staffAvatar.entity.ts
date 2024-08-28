import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { StaffAvatarDTO } from '../DTO/staffAvatar/staffAvatar.dto';

@Entity('staff_avatar')
export class StaffAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_folder' })
  fileFolder: string;

  @Column({ name: 'file_url' })
  fileUrl: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ name: 'cloud_id' })
  cloudId: string;

  @Column({ type: 'bigint', default: () => '0' })
  ts: number = new Date().getTime();

  toStaffAvatarDTO(): StaffAvatarDTO {
    const staffAvatarDTO = new StaffAvatarDTO();
    staffAvatarDTO.id = this.id;
    staffAvatarDTO.fileName = this.fileName;
    staffAvatarDTO.fileFolder = this.fileFolder;
    staffAvatarDTO.fileUrl = this.fileUrl;
    staffAvatarDTO.fileType = this.fileType;
    staffAvatarDTO.cloudId = this.cloudId;
    staffAvatarDTO.ts = this.ts;
    return staffAvatarDTO;
  }
}
