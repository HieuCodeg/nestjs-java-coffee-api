// services/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { User } from 'src/models/entities/user.entity';
import { UserRepository } from 'src/repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
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
    return this.userRepository.findOneBy({ username });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOneBy({ username });
  }

  async findByCodeFirstLogin(codeFirstLogin: string): Promise<User | null> {
    return this.userRepository.findOneBy({ codeFirstLogin });
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.findOneBy({ username });
    return !!user;
  }

  async softDelete(userId: number): Promise<void> {
    await this.userRepository.softDelete(userId);
  }

  async recovery(userId: number): Promise<void> {
    await this.userRepository.recovery(userId);
  }
}
