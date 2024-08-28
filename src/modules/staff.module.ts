import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryUploadUtil } from 'src/common/cloudinary.utils';
import { LocationRegion } from 'src/models/entities/location.entity';
import { Staff } from 'src/models/entities/staff.entity';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';
import { StaffRepository } from 'src/repositories/staff.repository';
import { UserRepository } from 'src/repositories/user.repository';
import { LocationRegionService } from 'src/services/locationRegion/location-region.service';
import { StaffServiceImpl } from 'src/services/staff/staff.service';
import { StaffAvatarService } from 'src/services/staffAvatar/staff-avatar.service';
import { UploadServiceImpl } from 'src/services/upload/upload.service';
import { UserService } from 'src/services/user/user.service';
import { CloudinaryModule } from './cloudinary.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Staff, StaffAvatar, LocationRegion]),
    CloudinaryModule,
  ],
  controllers: [],
  providers: [
    StaffRepository,
    StaffAvatarService,
    LocationRegionService,
    UserService,
    UploadServiceImpl,
    CloudinaryUploadUtil,
    StaffServiceImpl,
    UserRepository,
  ],
  exports: [StaffServiceImpl],
})
export class StaffModule {}
