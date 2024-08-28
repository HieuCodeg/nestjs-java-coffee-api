// interfaces/staff-avatar-service.interface.ts
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';

export interface IStaffAvatarService {
  findById(id: string): Promise<StaffAvatar | null>;
  delete(id: string): Promise<void>;
}
