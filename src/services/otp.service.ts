import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from 'src/models/entities/otp.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OtpServiceImpl {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  //   async findAll(): Promise<Otp[]> {
  //     return [];
  //   }

  //   async getById(id: number): Promise<Otp> {
  //     return null;
  //   }

  async getOtpByUserId(userId: number): Promise<Otp | undefined> {
    return this.otpRepository
      .createQueryBuilder('otp')
      .select(['otp.id', 'otp.code', 'otp.user'])
      .where('otp.deleted = :deleted', { deleted: false })
      .andWhere('otp.id = :userId', { userId })
      .getOne();
  }

  //   async findById(id: number): Promise<Optional<Otp>> {
  //     return Optional.empty();
  //   }

  async getByCode(code: string): Promise<Otp> {
    return this.otpRepository.findOne({ where: { code } });
  }

  async save(otp: Otp): Promise<Otp> {
    return this.otpRepository.save(otp);
  }

  //   async remove(id: number): Promise<void> {
  //     // Logic để xóa OTP theo id
  //   }

  async softDelete(otpId: number): Promise<void> {
    this.otpRepository
      .createQueryBuilder()
      .update(Otp)
      .set({ deleted: true })
      .where('id = :otpId', { otpId })
      .execute();
  }
}
