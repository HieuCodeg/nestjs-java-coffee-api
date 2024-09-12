import { Expose } from 'class-transformer';
import { LocationRegion } from 'src/models/entities/location.entity';

export class LocationRegionDTO {
  @Expose()
  id: number;
  @Expose()
  provinceId: string;
  @Expose()
  provinceName: string;
  @Expose()
  districtId: string;
  @Expose()
  districtName: string;
  @Expose()
  wardId: string;
  @Expose()
  wardName: string;
  @Expose()
  address: string;

  toLocationRegion(): LocationRegion {
    const locationRegion = new LocationRegion();
    locationRegion.id = this.id;
    locationRegion.provinceId = this.provinceId;
    locationRegion.provinceName = this.provinceName;
    locationRegion.districtId = this.districtId;
    locationRegion.districtName = this.districtName;
    locationRegion.wardId = this.wardId;
    locationRegion.wardName = this.wardName;
    locationRegion.address = this.address;
    return locationRegion;
  }
}
