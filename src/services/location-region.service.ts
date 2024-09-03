// services/location-region.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LocationRegion } from 'src/models/entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationRegionService {
  constructor(
    @InjectRepository(LocationRegion)
    private readonly locationRegionRepository: Repository<LocationRegion>,
  ) {}

  async findAll(): Promise<LocationRegion[]> {
    return this.locationRegionRepository.find();
  }

  async getById(id: number): Promise<LocationRegion | null> {
    return this.locationRegionRepository.findOneBy({ id });
  }

  async findById(id: number): Promise<LocationRegion | null> {
    return this.locationRegionRepository.findOneBy({ id });
  }

  async save(locationRegion: LocationRegion): Promise<LocationRegion> {
    return this.locationRegionRepository.save(locationRegion);
  }

  async remove(id: number): Promise<void> {
    await this.locationRegionRepository.delete(id);
  }
}
