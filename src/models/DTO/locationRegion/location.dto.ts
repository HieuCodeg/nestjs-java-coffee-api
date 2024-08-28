import { LocationRegion } from 'src/models/entities/location.entity';

export class LocationRegionDTO {
  id: number;
  provinceId: string;
  provinceName: string;
  districtId: string;
  districtName: string;
  wardId: string;
  wardName: string;
  address: string;

  constructor(partial: Partial<LocationRegionDTO>) {
    Object.assign(this, partial);
  }

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
