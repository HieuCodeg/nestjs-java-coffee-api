// services/staff-avatar.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StaffAvatarService {
  constructor(
    @InjectRepository(StaffAvatar)
    private readonly staffAvatarRepository: Repository<StaffAvatar>,
  ) {}

  async findAll(): Promise<StaffAvatar[]> {
    return this.staffAvatarRepository.find();
  }

  async getById(id: string): Promise<StaffAvatar | null> {
    return this.staffAvatarRepository.findOneBy({ id });
  }

  async findById(id: string): Promise<StaffAvatar | null> {
    return this.staffAvatarRepository.findOneBy({ id });
  }

  async save(staffAvatar: StaffAvatar): Promise<StaffAvatar> {
    return this.staffAvatarRepository.save(staffAvatar);
  }

  async remove(id: number): Promise<void> {
    await this.staffAvatarRepository.delete(id);
  }

  async delete(id: string): Promise<void> {
    await this.staffAvatarRepository.delete(id);
  }
}
