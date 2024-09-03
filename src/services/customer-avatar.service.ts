import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerAvatar } from 'src/models/entities/customerAvatar.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerAvatarServiceImpl {
  constructor(
    @InjectRepository(CustomerAvatar)
    private readonly customerAvatarRepository: Repository<CustomerAvatar>,
  ) {}

  async findAll(): Promise<CustomerAvatar[]> {
    return []; // Trả về danh sách rỗng tương tự null trong Java
  }

  //   async getById(id: number): Promise<CustomerAvatar> {
  //     const customerAvatar = await this.customerAvatarRepository.findOneBy({
  //       id,
  //     });
  //     if (!customerAvatar) {
  //       throw new NotFoundException(`CustomerAvatar with ID ${id} not found`);
  //     }
  //     return customerAvatar;
  //   }

  //   async findById(id: number): Promise<CustomerAvatar | null> {
  //     return this.customerAvatarRepository.findOneBy({ id });
  //   }

  //   async save(customerAvatar: CustomerAvatar): Promise<CustomerAvatar> {
  //     return null; // Trả về null tương tự trong Java
  //   }

  //   async remove(id: number): Promise<void> {
  //     // Đoạn code để xóa hoặc đánh dấu xóa
  //   }
}
