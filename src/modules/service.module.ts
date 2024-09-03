import { Module } from '@nestjs/common';
import { ModelModule } from './model.module';
import { StaffServiceImpl } from 'src/services/staff.service';
import { StaffAvatarService } from 'src/services/staff-avatar.service';
import { UploadServiceImpl } from 'src/services/upload.service';
import { UserService } from 'src/services/user.service';
import { UntilModule } from './until.module';
import { CloudinaryModule } from './cloudinary.module';
import { LocationRegionService } from 'src/services/location-region.service';

@Module({
  imports: [ModelModule, UntilModule, CloudinaryModule],
  providers: [
    LocationRegionService,
    StaffServiceImpl,
    StaffAvatarService,
    UploadServiceImpl,
    UserService,
  ],
  exports: [
    LocationRegionService,
    StaffServiceImpl,
    StaffAvatarService,
    UploadServiceImpl,
    UserService,
  ],
})
export class ServiceModule {}
