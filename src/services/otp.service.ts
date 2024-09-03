import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from 'src/models/entities/otp.entity';
import { OtpRepository } from 'src/repositories/otp.repository';

@Injectable()
export class OtpServiceImpl {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: OtpRepository,
  ) {}

  //   async findAll(): Promise<Otp[]> {
  //     return [];
  //   }

  //   async getById(id: number): Promise<Otp> {
  //     return null;
  //   }

  async getOtpByUserId(userId: number): Promise<Otp | undefined> {
    return this.otpRepository.getOtpByUserId(userId);
  }

  //   async findById(id: number): Promise<Optional<Otp>> {
  //     return Optional.empty();
  //   }

  async getByCode(code: string): Promise<Otp> {
    return this.otpRepository.getByCode(code);
  }

  async save(otp: Otp): Promise<Otp> {
    return this.otpRepository.save(otp);
  }

  //   async remove(id: number): Promise<void> {
  //     // Logic để xóa OTP theo id
  //   }

  async softDelete(otpId: number): Promise<void> {
    this.otpRepository.softDelete(otpId);
  }
}
