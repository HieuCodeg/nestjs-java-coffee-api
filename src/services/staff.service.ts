import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CloudinaryUploadUtil } from 'src/common/cloudinary.utils';
import { StaffDTO } from 'src/models/DTO/staff/staff.dto';
import { StaffCreateDTO } from 'src/models/DTO/staff/staffCreate.dto';
import { LocationRegion } from 'src/models/entities/location.entity';
import { Staff } from 'src/models/entities/staff.entity';
import { StaffAvatar } from 'src/models/entities/staffAvatar.entity';
import { User } from 'src/models/entities/user.entity';
import { EnumRole } from 'src/models/enums/enum.role';
import { EnumFileType } from 'src/models/enums/enumFileType';
import { DataSource, EntityMetadata, Not, Repository } from 'typeorm';
import { LocationRegionService } from './location-region.service';
import { StaffAvatarService } from './staff-avatar.service';
import { UploadServiceImpl } from './upload.service';
import { UserService } from './user.service';
import { AppUtils } from 'src/common/app.untils';
@Injectable()
export class StaffServiceImpl {
  private readonly DEFAULT_USER_IMAGE_ID = 'default_user_image';

  constructor(
    @InjectRepository(Staff)
    private readonly staffRepository: Repository<Staff>,
    private readonly staffAvatarService: StaffAvatarService,
    private readonly locationRegionService: LocationRegionService,
    private readonly userService: UserService,
    private readonly uploadService: UploadServiceImpl,
    private readonly cloudinaryUploadUtil: CloudinaryUploadUtil,
    private readonly dataSource: DataSource,
    private readonly appUtils: AppUtils,
  ) {}

  async findAll(): Promise<Staff[]> {
    return this.staffRepository.find();
  }

  async getAllStaffDTOWhereDeletedIsFalse(): Promise<StaffDTO[]> {
    return this.staffRepository
      .createQueryBuilder('st')
      .select([
        'st.id',
        'st.fullName',
        'st.phone',
        'st.dob',
        'st.gender',
        'st.locationRegion',
        'st.user',
        'st.avatar',
      ])
      .where('st.deleted = :deleted', { deleted: false })
      .getRawMany<StaffDTO>();
  }

  async getAllStaffDTOWhereDeletedIsTrue(): Promise<StaffDTO[]> {
    return this.staffRepository
      .createQueryBuilder('st')
      .select([
        'st.id',
        'st.fullName',
        'st.phone',
        'st.dob',
        'st.gender',
        'st.locationRegion',
        'st.user',
        'st.avatar',
      ])
      .where('st.deleted = :deleted', { deleted: true })
      .getRawMany<StaffDTO>();
  }

  async getAllStaffDTOWhereDeletedIsFalseAndIdNot(
    staffId: number,
  ): Promise<StaffDTO[]> {
    return this.staffRepository
      .createQueryBuilder('st')
      .select([
        'st.id',
        'st.fullName',
        'st.phone',
        'st.dob',
        'st.gender',
        'st.locationRegion',
        'st.user',
        'st.avatar',
      ])
      .where('st.deleted = :deleted', { deleted: false })
      .andWhere('st.id <> :staffId', { staffId })
      .andWhere('st.user.role.code <> :roleCode', {
        roleCode: EnumRole.ROLE_CUSTOMER,
      })
      .getRawMany<StaffDTO>();
  }

  async getByUsernameDTO(username: string): Promise<StaffDTO | null> {
    const metadata: EntityMetadata = this.dataSource.getMetadata(Staff);
    const relations = this.appUtils.getNestedRelations(metadata);
    const staff = await this.staffRepository.findOne({
      where: {
        user: { username },
        deleted: false,
      },
      relations,
    });

    const staffDTO = staff.toStaffDTO();

    return staffDTO ?? null;
  }

  async getById(id: number): Promise<Staff> {
    return this.staffRepository.findOneBy({ id });
  }

  async findById(id: number): Promise<Staff | null> {
    return this.staffRepository.findOne({ where: { id } });
  }

  async save(staff: Staff): Promise<Staff> {
    return this.staffRepository.save(staff);
  }

  async createWithAvatar(
    staffCreateDTO: StaffCreateDTO,
    locationRegion: LocationRegion,
    user: User,
    file: Express.Multer.File,
  ): Promise<Staff> {
    locationRegion = await this.locationRegionService.save(locationRegion);
    user = await this.userService.save(user);

    const fileType = file.mimetype.split('/')[0];
    let staffAvatar = new StaffAvatar();
    staffAvatar.fileType = fileType;
    staffAvatar = await this.staffAvatarService.save(staffAvatar);

    if (fileType === EnumFileType.IMAGE) {
      staffAvatar = await this.uploadAndSaveStaffAvatar(file, staffAvatar);
    }

    const staff = staffCreateDTO.toStaff(user, locationRegion, staffAvatar);
    staff.id = null;

    return this.staffRepository.save(staff);
  }

  async createNoAvatar(
    staffCreateDTO: StaffCreateDTO,
    locationRegion: LocationRegion,
    user: User,
  ): Promise<Staff> {
    locationRegion = await this.locationRegionService.save(locationRegion);
    user = await this.userService.save(user);

    let staffAvatar = await this.staffAvatarService.findById(
      this.DEFAULT_USER_IMAGE_ID,
    );
    staffAvatar = await this.staffAvatarService.save(staffAvatar);

    const staff = staffCreateDTO.toStaff(user, locationRegion, staffAvatar);
    staff.id = null;

    return this.staffRepository.save(staff);
  }

  async saveWithLocationRegion(staff: Staff): Promise<Staff> {
    await this.locationRegionService.save(staff.locationRegion);
    return this.staffRepository.save(staff);
  }

  async saveNoAvatar(staff: Staff): Promise<Staff> {
    await this.userService.saveNoPassword(staff.user);
    await this.locationRegionService.save(staff.locationRegion);
    return this.staffRepository.save(staff);
  }

  async saveWithAvatar(
    staff: Staff,
    file: Express.Multer.File,
  ): Promise<Staff> {
    const fileType = file.mimetype.split('/')[0];
    let staffAvatar = new StaffAvatar();
    staffAvatar.fileType = fileType;

    staffAvatar = await this.staffAvatarService.save(staffAvatar);

    if (fileType === EnumFileType.IMAGE) {
      staffAvatar = await this.uploadAndSaveStaffAvatar(file, staffAvatar);
    }

    staff.avatar = staffAvatar;
    return this.staffRepository.save(staff);
  }

  async uploadAndSaveStaffAvatar(
    file: Express.Multer.File,
    staffAvatar: StaffAvatar,
  ): Promise<StaffAvatar> {
    try {
      const uploadResult = await this.uploadService.uploadImage(
        file,
        this.cloudinaryUploadUtil.buildImageUploadParams(
          staffAvatar.id,
          this.cloudinaryUploadUtil.STAFF_IMAGE_UPLOAD_FOLDER,
          this.cloudinaryUploadUtil.ERROR_IMAGE_UPLOAD,
        ),
      );

      const fileUrl = uploadResult.secure_url;
      const fileFormat = uploadResult.format;

      staffAvatar.fileName = `${staffAvatar.id}.${fileFormat}`;
      staffAvatar.fileUrl = fileUrl;
      staffAvatar.fileFolder =
        this.cloudinaryUploadUtil.STAFF_IMAGE_UPLOAD_FOLDER;
      staffAvatar.cloudId = `${staffAvatar.fileFolder}/${staffAvatar.id}`;

      return this.staffAvatarService.save(staffAvatar);
    } catch (error) {
      console.error(error);
      throw new Error('Upload hình ảnh thất bại.');
    }
  }

  async remove(id: number): Promise<void> {
    await this.staffRepository.delete(id);
  }

  async softDelete(staffId: number): Promise<void> {
    await this.staffRepository
      .createQueryBuilder()
      .update()
      .set({ deleted: true })
      .where('id = :staffId', { staffId })
      .execute();
  }

  async recoveryAccount(staffId: number): Promise<void> {
    await this.staffRepository
      .createQueryBuilder()
      .update()
      .set({ deleted: false })
      .where('id = :staffId', { staffId })
      .execute();
  }

  async findByPhone(phone: string): Promise<Staff | null> {
    return this.staffRepository.findOne({ where: { phone } });
  }

  async existsByPhoneAndIdNot(phone: string, id: number): Promise<boolean> {
    const count = await this.staffRepository
      .createQueryBuilder('st')
      .where('st.phone = :phone', { phone })
      .andWhere('st.id <> :id', { id })
      .getCount();
    return count > 0;
  }

  async findAllByIdNot(id: number): Promise<Staff[]> {
    return this.staffRepository.find({ where: { id: Not(id) } });
  }
}
