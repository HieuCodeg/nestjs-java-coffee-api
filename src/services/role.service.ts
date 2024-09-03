import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleDTO } from 'src/models/DTO/role/role.dto';
import { Role } from 'src/models/entities/role.entity';
import { RoleRepository } from 'src/repositories/role.repository';

@Injectable()
export class RoleServiceImpl {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: RoleRepository,
  ) {}

  async findAll(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async findById(id: number): Promise<Role | undefined> {
    return this.roleRepository.findOneBy({ id });
  }

  //   async getById(id: number): Promise<Role> {
  //     return null; // Thay bằng logic thực tế nếu cần
  //   }

  async save(role: Role): Promise<Role> {
    return this.roleRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.delete(id);
  }

  async findByCode(name: string): Promise<Role> {
    return this.roleRepository.findByCode(name);
  }

  async getAllRoleDTONoCustomer(): Promise<RoleDTO[]> {
    return this.roleRepository.getAllRoleDTONoCustomer();
  }

  async getAllRoleDTONoAdminAndCustomer(): Promise<RoleDTO[]> {
    return this.roleRepository.getAllRoleDTONoAdminAndCustomer();
  }
}
