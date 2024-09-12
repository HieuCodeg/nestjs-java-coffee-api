// services/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from 'src/models/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async getById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async save(user: User): Promise<User> {
    user.password = await hash(user.password, 10);
    return this.userRepository.save(user);
  }

  async saveNoPassword(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async getByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { username },
      relations: ['role'],
    });
  }

  async findByCodeFirstLogin(codeFirstLogin: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { codeFirstLogin } });
  }

  async existsByUsername(username: string): Promise<boolean> {
    // const count = await this.count({ where: { username } });
    // return count > 0;
    const user = await this.userRepository.findOneBy({ username });
    return !!user;
  }

  async softDelete(userId: number): Promise<void> {
    await this.userRepository.update(userId, { deleted: true });
  }

  async recovery(userId: number): Promise<void> {
    await this.userRepository.update(userId, { deleted: false });
  }
}
