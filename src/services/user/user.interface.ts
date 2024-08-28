// interfaces/user-service.interface.ts

import { User } from 'src/models/entities/user.entity';

export interface IUserService {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  getById(id: number): Promise<User | null>;
  save(user: User): Promise<User>;
  saveNoPassword(user: User): Promise<User>;
  remove(id: number): Promise<void>;
  getByUsername(username: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByCodeFirstLogin(codeFirstLogin: string): Promise<User | null>;
  existsByUsername(username: string): Promise<boolean>;
  softDelete(userId: number): Promise<void>;
  recovery(userId: number): Promise<void>;
}
