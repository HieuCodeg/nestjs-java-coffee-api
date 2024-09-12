import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import { resolve } from 'path';
import { AppUtils } from 'src/common/app.untils';
import { StaffCreateDTO } from 'src/models/DTO/staff/staffCreate.dto';
import { LocationRegion } from 'src/models/entities/location.entity';
import { Role } from 'src/models/entities/role.entity';
import { Staff } from 'src/models/entities/staff.entity';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';
import { User } from 'src/models/entities/user.entity';
import { EnumGender } from 'src/models/enums/enumGender';
import { LocationRegionService } from './location-region.service';
import { RoleServiceImpl } from './role.service';
import { StaffAvatarService } from './staff-avatar.service';
import { StaffServiceImpl } from './staff.service';
import { UserService } from './user.service';
import { DataSource } from 'typeorm';

@Injectable()
export class AdminSeeder implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userService: UserService,
    private readonly roleService: RoleServiceImpl,
    private readonly staffService: StaffServiceImpl,
    private readonly locationRegionService: LocationRegionService,
    private readonly staffAvatarService: StaffAvatarService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  async createDefaultAdmin() {
    try {
      const adminRole: Role = await this.roleService.findByCode('ADMIN');
      if (!adminRole) {
        console.error(
          'Vai trò quản trị không tồn tại. Vui lòng tạo vai trò đó trước.',
        );
        return;
      }

      let adminUser: User =
        await this.userService.findByUsername('admin@gmail.com');

      const existingAdminStaff: Staff =
        await this.staffService.findByPhone('0999999999');

      let staffAvatar = await this.staffAvatarService.findById(
        AppUtils.DEFAULT_USER_IMAGE_ID,
      );

      if (!adminUser) {
        const newAdminUser: User = new User();
        newAdminUser.username = 'admin@gmail.com';
        newAdminUser.password = '12345678';
        newAdminUser.role = adminRole;
        newAdminUser.isFirstLogin = false;
        newAdminUser.codeFirstLogin = null;

        adminUser = await this.userService.save(adminUser);
        console.log('Đã tạo thành công quản trị viên mặc định.');
      } else {
        console.log('Admin user already exists.');
      }
      await this.dataSource.transaction(async (transactionalEntityManager) => {
        if (!existingAdminStaff) {
          const adminUserStaff: StaffCreateDTO = new StaffCreateDTO();
          adminUserStaff.fullName = 'Nguyễn Minh Hiếu';
          adminUserStaff.dob = '1999-01-01';
          adminUserStaff.gender = EnumGender.MALE;
          adminUserStaff.phone = '0999999999';
          adminUserStaff.username = 'admin@gmail.com';
          adminUserStaff.password = '12345678';
          adminUserStaff.roleId = adminRole.id.toString(); // Ensure roleId is a string
          adminUserStaff.provinceId = '46';
          adminUserStaff.provinceName = 'Tỉnh Thừa Thiên Huế';
          adminUserStaff.districtId = '474';
          adminUserStaff.districtName = 'Thành phố Huế';
          adminUserStaff.wardId = '19815';
          adminUserStaff.wardName = 'Phường An Đông';
          adminUserStaff.address = 'Đường Ngô Gia Cát';

          let locationRegion: LocationRegion =
            adminUserStaff.toLocationRegion();

          locationRegion = await transactionalEntityManager
            .getRepository(LocationRegion)
            .save(locationRegion);

          if (!staffAvatar) {
            const imagePath = resolve(
              './public/images/user/default_user_image.jpg',
            );
            const fileBuffer = await fs.promises.readFile(imagePath);
            const file: Express.Multer.File = {
              fieldname: 'file',
              originalname: 'default_user_image.jpg',
              encoding: '7bit',
              mimetype: 'image/jpeg',
              buffer: fileBuffer,
              size: fileBuffer.length,
              stream: null,
              destination: null,
              filename: 'default_user_image.jpg',
              path: imagePath,
            };
            staffAvatar = new StaffAvatar();
            staffAvatar.fileType = 'image';
            staffAvatar.id = 'default_user_image';
            staffAvatar = await this.staffService.uploadAndSaveStaffAvatar(
              file,
              staffAvatar,
            );
          }

          const staff: Staff = adminUserStaff.toStaff(
            adminUser,
            locationRegion,
            staffAvatar,
          );
          await transactionalEntityManager.getRepository(Staff).save(staff);
          console.log('Đã tạo thành công quản trị viên mặc định.');
        } else {
          console.log('Số điện thoại đã tồn tại trong hệ thống.');
        }
      });
    } catch (error) {
      console.error('Lỗi khi tạo tài khoản admin mặc định:', error.message);
    }
  }
  // async createDefaultAdmin() {
  //   return await this.dataSource.transaction(
  //     async (transactionalEntityManager) => {
  //       try {
  //         const adminRole: Role = await transactionalEntityManager
  //           .getRepository(Role)
  //           .findOneBy({ code: 'ADMIN' });

  //         if (!adminRole) {
  //           console.error(
  //             'Vai trò quản trị không tồn tại. Vui lòng tạo vai trò đó trước.',
  //           );
  //           return;
  //         }

  //         let adminUser: User = await transactionalEntityManager
  //           .getRepository(User)
  //           .findOneBy({ username: 'admin@gmail.com' });

  //         if (!adminUser) {
  //           const newAdminUser = new User();
  //           newAdminUser.username = 'admin@gmail.com';
  //           newAdminUser.password = '12345678';
  //           newAdminUser.role = adminRole;
  //           newAdminUser.isFirstLogin = false;
  //           newAdminUser.codeFirstLogin = null;

  //           adminUser = await transactionalEntityManager
  //             .getRepository(User)
  //             .save(newAdminUser);
  //           console.log('Đã tạo thành công quản trị viên mặc định.');
  //         } else {
  //           console.log('Admin user already exists.');
  //         }

  //         const existingAdminStaff: Staff = await transactionalEntityManager
  //           .getRepository(Staff)
  //           .findOneBy({ phone: '0999999999' });

  //         if (!existingAdminStaff) {
  //           const adminUserStaff: StaffCreateDTO = new StaffCreateDTO();
  //           adminUserStaff.fullName = 'Nguyễn Minh Hiếu';
  //           adminUserStaff.dob = '1999-01-01';
  //           adminUserStaff.gender = EnumGender.MALE;
  //           adminUserStaff.phone = '0999999999';
  //           adminUserStaff.username = 'admin@gmail.com';
  //           adminUserStaff.password = '12345678';
  //           adminUserStaff.roleId = adminRole.id.toString(); // Ensure roleId is a string
  //           adminUserStaff.provinceId = '46';
  //           adminUserStaff.provinceName = 'Tỉnh Thừa Thiên Huế';
  //           adminUserStaff.districtId = '474';
  //           adminUserStaff.districtName = 'Thành phố Huế';
  //           adminUserStaff.wardId = '19815';
  //           adminUserStaff.wardName = 'Phường An Đông';
  //           adminUserStaff.address = 'Đường Ngô Gia Cát';

  //           let locationRegion: LocationRegion =
  //             adminUserStaff.toLocationRegion();
  //           locationRegion = await transactionalEntityManager
  //             .getRepository(LocationRegion)
  //             .save(locationRegion);

  //           let staffAvatar: StaffAvatar = await transactionalEntityManager
  //             .getRepository(StaffAvatar)
  //             .findOneBy({ id: AppUtils.DEFAULT_USER_IMAGE_ID }); // findOneBy replaces findOne({ where: ... })

  //           if (!staffAvatar) {
  //             const imagePath = resolve(
  //               './public/images/user/default_user_image.jpg',
  //             );
  //             const fileBuffer = await fs.promises.readFile(imagePath);
  //             const file: Express.Multer.File = {
  //               fieldname: 'file',
  //               originalname: 'default_user_image.jpg',
  //               encoding: '7bit',
  //               mimetype: 'image/jpeg',
  //               buffer: fileBuffer,
  //               size: fileBuffer.length,
  //               stream: null,
  //               destination: null,
  //               filename: 'default_user_image.jpg',
  //               path: imagePath,
  //             };
  //             staffAvatar = new StaffAvatar();
  //             staffAvatar.fileType = 'image';
  //             staffAvatar = await transactionalEntityManager
  //               .getRepository(StaffAvatar)
  //               .save(staffAvatar);
  //             staffAvatar = await this.staffService.uploadAndSaveStaffAvatar(
  //               file,
  //               staffAvatar,
  //             );
  //           }

  //           const staff: Staff = adminUserStaff.toStaff(
  //             adminUser,
  //             locationRegion,
  //             staffAvatar,
  //           );
  //           await transactionalEntityManager.getRepository(Staff).save(staff);
  //           console.log('Đã tạo thành công quản trị viên mặc định.');
  //         } else {
  //           console.log('Số điện thoại đã tồn tại trong hệ thống.');
  //         }
  //       } catch (error) {
  //         console.error('Transaction failed: ' + error.message);
  //         throw error; // Ném lỗi để TypeORM biết rằng transaction cần rollback
  //       }
  //     },
  //   );
  // }
}
