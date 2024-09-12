import { CustomerAvatar } from 'src/models/entities/customerAvatar.entity';
import { CustomerDTO } from '../customer/customer.dto';
import { Expose } from 'class-transformer';

export class CustomerAvatarDTO {
  @Expose()
  id: string;
  @Expose()
  fileName: string;
  @Expose()
  fileFolder: string;
  @Expose()
  fileUrl: string;
  @Expose()
  fileType: string;
  @Expose()
  cloudId: string;
  @Expose()
  ts: number;
  @Expose()
  customer: CustomerDTO;

  constructor(partial: Partial<CustomerAvatarDTO>) {
    Object.assign(this, partial);
  }

  toCustomerAvatar(): CustomerAvatar {
    const customerAvatar = new CustomerAvatar();
    customerAvatar.id = this.id;
    customerAvatar.fileName = this.fileName;
    customerAvatar.fileFolder = this.fileFolder;
    customerAvatar.fileUrl = this.fileUrl;
    customerAvatar.fileType = this.fileType;
    customerAvatar.cloudId = this.cloudId;
    customerAvatar.ts = this.ts;
    customerAvatar.customer = this.customer.toCustomer();
    return customerAvatar;
  }
}
