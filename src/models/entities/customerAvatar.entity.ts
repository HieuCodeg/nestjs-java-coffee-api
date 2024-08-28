import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { CustomerAvatarDTO } from '../DTO/customerAvatar/customerAvatar.dto';

@Entity('customer_avatar')
export class CustomerAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'file_name' })
  fileName: string;

  @Column({ name: 'file_folder' })
  fileFolder: string;

  @Column({ name: 'file_url' })
  fileUrl: string;

  @Column({ name: 'file_type' })
  fileType: string;

  @Column({ name: 'cloud_id' })
  cloudId: string;

  @Column({ type: 'bigint', default: () => '0' })
  ts: number = new Date().getTime();

  @OneToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  toCustomerAvatarDTO(): CustomerAvatarDTO {
    return new CustomerAvatarDTO({
      id: this.id,
      fileName: this.fileName,
      fileFolder: this.fileFolder,
      fileUrl: this.fileUrl,
      fileType: this.fileType,
      cloudId: this.cloudId,
      ts: this.ts,
      customer: this.customer.toCustomerDTO(),
    });
  }
}
