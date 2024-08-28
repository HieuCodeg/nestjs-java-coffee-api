import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { CustomerDTO } from '../DTO/customer/customer.dto';
import { LocationRegion } from './location.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({ unique: true, nullable: false })
  phone: string;

  @Column({ type: 'decimal', precision: 12, scale: 0, nullable: false })
  balance: number;

  @OneToOne(() => LocationRegion)
  @JoinColumn({ name: 'location_region_id' })
  locationRegion: LocationRegion;

  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: User;

  toCustomerDTO(): CustomerDTO {
    return new CustomerDTO({
      id: this.id,
      fullName: this.fullName,
      phone: this.phone,
      balance: this.balance,
      locationRegion: this.locationRegion.toLocationRegionDTO(),
      user: this.user.toUserDTO(),
    });
  }
}
