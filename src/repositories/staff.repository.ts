import { Injectable } from '@nestjs/common';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { Staff } from 'src/models/entities/staff.entity';
import { EnumRole } from 'src/models/enums/enum.role';
import { Repository, UpdateResult } from 'typeorm';
import { Not } from 'typeorm';

@Injectable()
export class StaffRepository extends Repository<Staff> {
  async getAllStaffDTOWhereDeletedIsFalse(): Promise<StaffDTO[]> {
    return this.createQueryBuilder('st')
      .select([
        'st.id',
        'st.fullName',
        'st.phone',
        'st.dob',
        'st.gender',
        'st.locationRegion',
        'st.user',
        'st.avatar',
      ])
      .where('st.deleted = :deleted', { deleted: false })
      .getRawMany<StaffDTO>();
  }

  async getAllStaffDTOWhereDeletedIsTrue(): Promise<StaffDTO[]> {
    return this.createQueryBuilder('st')
      .select([
        'st.id',
        'st.fullName',
        'st.phone',
        'st.dob',
        'st.gender',
        'st.locationRegion',
        'st.user',
        'st.avatar',
      ])
      .where('st.deleted = :deleted', { deleted: true })
      .getRawMany<StaffDTO>();
  }

  async getAllStaffDTOWhereDeletedIsFalseAndIdNot(
    staffId: number,
  ): Promise<StaffDTO[]> {
    return this.createQueryBuilder('st')
      .select([
        'st.id',
        'st.fullName',
        'st.phone',
        'st.dob',
        'st.gender',
        'st.locationRegion',
        'st.user',
        'st.avatar',
      ])
      .where('st.deleted = :deleted', { deleted: false })
      .andWhere('st.id <> :staffId', { staffId })
      .andWhere('st.user.role.code <> :roleCode', {
        roleCode: EnumRole.ROLE_CUSTOMER,
      })
      .getRawMany<StaffDTO>();
  }

  async getByUsernameDTO(username: string): Promise<StaffDTO | null> {
    return this.createQueryBuilder('st')
      .select([
        'st.id',
        'st.fullName',
        'st.phone',
        'st.dob',
        'st.gender',
        'st.locationRegion',
        'st.user',
        'st.avatar',
      ])
      .where('st.deleted = :deleted', { deleted: false })
      .andWhere('st.user.username = :username', { username })
      .getRawOne<StaffDTO>();
  }

  async softDelete(staffId: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({ deleted: true })
      .where('id = :staffId', { staffId })
      .execute();
  }

  async recoveryAccount(staffId: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update()
      .set({ deleted: false })
      .where('id = :staffId', { staffId })
      .execute();
  }

  async existsByPhoneAndIdNot(phone: string, id: number): Promise<boolean> {
    const count = await this.createQueryBuilder('st')
      .where('st.phone = :phone', { phone })
      .andWhere('st.id <> :id', { id })
      .getCount();
    return count > 0;
  }

  async findByPhone(phone: string): Promise<Staff | null> {
    return this.findOne({ where: { phone } });
  }

  async findAllByIdNot(id: number): Promise<Staff[]> {
    return this.find({ where: { id: Not(id) } });
  }
}
