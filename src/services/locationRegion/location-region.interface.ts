// interfaces/location-region-service.interface.ts

import { LocationRegion } from 'src/models/entities/location.entity';

export interface ILocationRegionService {
  findAll(): Promise<LocationRegion[]>;
  getById(id: number): Promise<LocationRegion | null>;
  findById(id: number): Promise<LocationRegion | null>;
  save(locationRegion: LocationRegion): Promise<LocationRegion>;
  remove(id: number): Promise<void>;
}
