import { Staff } from 'src/models/entities/staff.entity';
import { IGeneralService } from '../general.interface';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { StaffCreateDTO } from 'src/models/DTO/staff/staffCreate.dto';
import { LocationRegion } from 'src/models/entities/location.entity';
import { User } from 'src/models/entities/user.entity';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';

export interface IStaffService extends IGeneralService<Staff> {
  getAllStaffDTOWhereDeletedIsFalse(): Promise<StaffDTO[]>;

  getAllStaffDTOWhereDeletedIsTrue(): Promise<StaffDTO[]>;

  getAllStaffDTOWhereDeletedIsFalseAndIdNot(
    staffId: number,
  ): Promise<StaffDTO[]>;

  getByUsernameDTO(username: string): Promise<StaffDTO | null>;

  createWithAvatar(
    staffCreateDTO: StaffCreateDTO,
    locationRegion: LocationRegion,
    user: User,
    file: Express.Multer.File,
  ): Promise<Staff>;

  createNoAvatar(
    staffCreateDTO: StaffCreateDTO,
    locationRegion: LocationRegion,
    user: User,
  ): Promise<Staff>;

  saveWithLocationRegion(staff: Staff): Promise<Staff>;

  saveNoAvatar(staff: Staff): Promise<Staff>;

  saveWithAvatar(staff: Staff, file: Express.Multer.File): Promise<Staff>;

  uploadAndSaveStaffAvatar(
    file: Express.Multer.File,
    staffAvatar: StaffAvatar,
  ): Promise<StaffAvatar>;

  softDelete(staffId: number): Promise<void>;

  recoveryAccount(staffId: number): Promise<void>;

  findByPhone(phone: string): Promise<Staff | null>;

  existsByPhoneAndIdNot(phone: string, id: number): Promise<boolean>;
}
