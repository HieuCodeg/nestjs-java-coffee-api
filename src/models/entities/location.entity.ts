import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { LocationRegionDTO } from '../DTO/locationRegion/location.dto';
import { BaseEntity } from './baseEntity';

@Entity('location_region')
export class LocationRegion extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'province_id', nullable: false })
  provinceId: string;

  @Column({ name: 'province_name', nullable: false })
  provinceName: string;

  @Column({ name: 'district_id', nullable: false })
  districtId: string;

  @Column({ name: 'district_name', nullable: false })
  districtName: string;

  @Column({ name: 'ward_id', nullable: false })
  wardId: string;

  @Column({ name: 'ward_name', nullable: false })
  wardName: string;

  @Column()
  address: string;

  toLocationRegionDTO(): LocationRegionDTO {
    return new LocationRegionDTO({
      id: this.id,
      provinceId: this.provinceId,
      provinceName: this.provinceName,
      districtId: this.districtId,
      districtName: this.districtName,
      wardId: this.wardId,
      wardName: this.wardName,
      address: this.address,
    });
  }
}
