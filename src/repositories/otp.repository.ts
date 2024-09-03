import { Injectable } from '@nestjs/common';
import { Otp } from 'src/models/entities/otp.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class OtpRepository extends Repository<Otp> {
  async getByCode(code: string): Promise<Otp | undefined> {
    return this.findOne({ where: { code } });
  }

  async getOtpByUserId(userId: number): Promise<Otp | undefined> {
    return this.createQueryBuilder('otp')
      .select(['otp.id', 'otp.code', 'otp.user'])
      .where('otp.deleted = :deleted', { deleted: false })
      .andWhere('otp.id = :userId', { userId })
      .getOne();
  }

  async softDelete(otpId: number): Promise<UpdateResult> {
    return this.createQueryBuilder()
      .update(Otp)
      .set({ deleted: true })
      .where('id = :otpId', { otpId })
      .execute();
  }
}
