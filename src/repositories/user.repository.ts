import { Injectable } from '@nestjs/common';
import { User } from 'src/models/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserRepository extends Repository<User> {
  async getByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ where: { username } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ where: { username } });
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.count({ where: { username } });
    return count > 0;
  }

  async findByCodeFirstLogin(
    codeFirstLogin: string,
  ): Promise<User | undefined> {
    return this.findOne({ where: { codeFirstLogin } });
  }

  async softDelete(userId: number): Promise<UpdateResult> {
    return this.update(userId, { deleted: true });
  }

  async recovery(userId: number): Promise<UpdateResult> {
    return this.update(userId, { deleted: false });
  }
}
