import { Customer } from 'src/models/entities/customer.entity';
import { LocationRegionDTO } from '../locationRegion/location.dto';
import { UserDTO } from '../user/user.dto';

export class CustomerDTO {
  id?: number;

  fullName: string;

  phone: string;

  balance: number;

  locationRegion: LocationRegionDTO;

  user: UserDTO;

  constructor(partial: Partial<CustomerDTO>) {
    Object.assign(this, partial);
  }

  toCustomer(): Customer {
    const customer = new Customer();
    customer.id = this.id;
    customer.fullName = this.fullName;
    customer.phone = this.phone;
    customer.balance = this.balance;
    customer.locationRegion = this.locationRegion.toLocationRegion();
    customer.user = this.user.toUser();
    return customer;
  }
}
