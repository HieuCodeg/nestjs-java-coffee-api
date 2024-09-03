import { Injectable } from '@nestjs/common';
import { RoleDTO } from 'src/models/DTO/role/role.dto';
import { Role } from 'src/models/entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
  async getAllRoleDTONoCustomer(): Promise<RoleDTO[]> {
    return this.createQueryBuilder('ro')
      .select(['ro.id', 'ro.code'])
      .where('ro.code <> :code', { code: 'CUSTOMER' })
      .getRawMany(); // Sử dụng getRawMany để lấy kết quả dạng DTO
  }

  async getAllRoleDTONoAdminAndCustomer(): Promise<RoleDTO[]> {
    return this.createQueryBuilder('ro')
      .select(['ro.id', 'ro.code'])
      .where('ro.code <> :adminCode', { adminCode: 'ADMIN' })
      .andWhere('ro.code <> :customerCode', { customerCode: 'CUSTOMER' })
      .getRawMany(); // Sử dụng getRawMany để lấy kết quả dạng DTO
  }

  async findByCode(code: string): Promise<Role | undefined> {
    return this.findOne({ where: { code } });
  }
}
