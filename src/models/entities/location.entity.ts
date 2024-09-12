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
    const locationRegionDTO = new LocationRegionDTO();
    locationRegionDTO.id = this.id;
    locationRegionDTO.provinceId = this.provinceId;
    locationRegionDTO.provinceName = this.provinceName;
    locationRegionDTO.districtId = this.districtId;
    locationRegionDTO.districtName = this.districtName;
    locationRegionDTO.wardId = this.wardId;
    locationRegionDTO.wardName = this.wardName;
    locationRegionDTO.address = this.address;
    return locationRegionDTO;
  }
}
