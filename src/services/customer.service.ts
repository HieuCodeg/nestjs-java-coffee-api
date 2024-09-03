import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/models/entities/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async getById(id: number): Promise<Customer> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async findById(id: number): Promise<Customer | null> {
    return await this.customerRepository.findOne({ where: { id } });
  }

  async save(customer: Customer): Promise<Customer> {
    return await this.customerRepository.save(customer);
  }

  async remove(id: number): Promise<void> {
    await this.customerRepository.delete(id);
  }
}
