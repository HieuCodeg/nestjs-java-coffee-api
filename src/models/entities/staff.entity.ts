import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from './baseEntity';
import { LocationRegion } from './location.entity';
import { User } from './user.entity';
import { EnumGender } from '../enums/enumGender';
import { StaffAvatar } from './staffAvatar.entity';
import { StaffDTO } from '../DTO/staff/staff.dto';
import { AppUtils } from 'src/common/app.untils';

@Entity('staffs')
export class Staff extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ type: 'date', nullable: false })
  dob: Date;

  @Column({ length: 10, nullable: false })
  gender: EnumGender;

  @Column({ unique: true, nullable: false })
  phone: string;

  @OneToOne(() => LocationRegion)
  @JoinColumn({ name: 'location_region_id' })
  locationRegion: LocationRegion;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  @OneToOne(() => StaffAvatar)
  @JoinColumn({ name: 'staff_avatar_id' })
  avatar: StaffAvatar;

  toStaffDTO(): StaffDTO {
    const staffDTO = new StaffDTO();
    staffDTO.id = this.id;
    staffDTO.fullName = this.fullName;
    staffDTO.dob = AppUtils.localDateToString(this.dob);
    staffDTO.gender = this.gender.toString();
    staffDTO.phone = this.phone;
    staffDTO.locationRegion = this.locationRegion?.toLocationRegionDTO();
    staffDTO.user = this.user?.toUserDTO();
    staffDTO.staffAvatar = this.avatar?.toStaffAvatarDTO();
    return staffDTO;
  }
}
