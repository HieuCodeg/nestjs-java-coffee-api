import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppUtils } from 'src/common/app.untils';
import { JwtAuthGuard } from 'src/config/jwt-auth.guard';
import { StaffCreateDTO } from 'src/models/DTO/staff/staffCreate.dto';
import { StaffUpdateDTO } from 'src/models/DTO/staff/staffUpdate.dto';
import { EmailSender } from 'src/services/email-sender.service';
import { RoleServiceImpl } from 'src/services/role.service';
import { StaffServiceImpl } from 'src/services/staff.service';
import { UserService } from 'src/services/user.service';
import { StaffUpdateYourselfDTO } from './../../models/DTO/staff/staffUpdateYourSelf.dto';
import { plainToClass } from 'class-transformer';

@UseGuards(JwtAuthGuard)
@Controller('api/staffs')
export class StaffController {
  constructor(
    private readonly staffService: StaffServiceImpl,
    private readonly appUtils: AppUtils,
    private readonly emailSender: EmailSender,
    private readonly userService: UserService,
    private readonly roleService: RoleServiceImpl,
  ) {}

  @Get()
  async getAllByDeletedIsFalse() {
    const staffDTOList =
      await this.staffService.getAllStaffDTOWhereDeletedIsFalse();
    if (staffDTOList.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }
    return staffDTOList;
  }

  @Get('/recovery')
  //   @UseGuards( RolesGuard)
  //   @Roles('ADMIN')
  async getAllByDeletedIsTrue() {
    const staffDTOList =
      await this.staffService.getAllStaffDTOWhereDeletedIsTrue();
    if (staffDTOList.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }
    return staffDTOList;
  }

  @Get('/get-all-staffs-where-id-not/:staffId')
  async getAllStaffDTOWhereDeletedIsFalseAndIdNot(
    @Param('staffId', ParseIntPipe) staffId: number,
  ) {
    const staffDTOS =
      await this.staffService.getAllStaffDTOWhereDeletedIsFalseAndIdNot(
        staffId,
      );
    if (staffDTOS.length === 0) {
      throw new HttpException('No content', HttpStatus.NO_CONTENT);
    }
    return staffDTOS;
  }

  @Get('/:staffId')
  async getById(@Param('staffId', ParseIntPipe) staffId: number) {
    const staffOptional = await this.staffService.findById(staffId);
    if (!staffOptional) {
      throw new HttpException(
        'ID nhân viên không hợp lệ.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return staffOptional.toStaffDTO();
  }

  @Get('/get-by-username/:username')
  async getByUsername(@Param('username') username: string) {
    const staffDTOOptional = await this.staffService.getByUsernameDTO(username);
    if (!staffDTOOptional) {
      throw new HttpException(
        'Nhân viên không hợp lệ.',
        HttpStatus.BAD_REQUEST,
      );
    }
    return staffDTOOptional;
  }

  @Post()
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  async createStaff(
    @UploadedFile() file: Express.Multer.File,
    @Body() staffCreateDTOPayload: StaffCreateDTO,
  ) {
    const staffCreateDTO = plainToClass(StaffCreateDTO, staffCreateDTOPayload);
    const userOptional = await this.userService.findByUsername(
      staffCreateDTO.username,
    );
    if (userOptional) {
      throw new HttpException(
        'Email đã tồn tại trong hệ thống.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const staffOptional = await this.staffService.findByPhone(
      staffCreateDTO.phone,
    );
    if (staffOptional) {
      throw new HttpException(
        'Số điện thoại đã tồn tại trong hệ thống.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const roleOptional = await this.roleService.findById(
      Number(staffCreateDTO.roleId),
    );
    if (!roleOptional) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const locationRegion = staffCreateDTO.toLocationRegion();
    locationRegion.id = null;

    const user = staffCreateDTO.toUser(roleOptional);
    user.id = null;
    user.isFirstLogin = true;
    user.codeFirstLogin = this.appUtils.randomOtp(12);
    user.password = this.appUtils.randomPassword(6);

    const newStaff = file
      ? await this.staffService.createWithAvatar(
          staffCreateDTO,
          locationRegion,
          user,
          file,
        )
      : await this.staffService.createNoAvatar(
          staffCreateDTO,
          locationRegion,
          user,
        );

    await this.emailSender.sendRegisterStaffEmail(newStaff, user.username);
    return newStaff.toStaffDTO();
  }

  @Patch('/:staffId')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file'))
  async updateStaff(
    @Param('staffId', ParseIntPipe) staffId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() staffUpdateDTOPayload: StaffUpdateDTO,
  ) {
    const staffUpdateDTO = plainToClass(StaffUpdateDTO, staffUpdateDTOPayload);
    let staff = await this.staffService.findById(staffId);
    if (!staff) {
      throw new HttpException(
        'ID nhân viên không tồn tại.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      await this.staffService.existsByPhoneAndIdNot(
        staffUpdateDTO.phone,
        staffId,
      )
    ) {
      throw new HttpException(
        'Số điện thoại đã tồn tại trong hệ thống.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const roleOptional = await this.roleService.findById(
      Number(staffUpdateDTO.roleId),
    );
    if (!roleOptional) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const newLocation = staffUpdateDTO.toLocationRegion();

    staff.fullName = staffUpdateDTO.fullName;
    staff.dob = AppUtils.stringToLocalDate(staffUpdateDTO.dob);
    staff.gender = staffUpdateDTO.gender;
    staff.phone = staffUpdateDTO.phone;
    staff.user.role = roleOptional;

    staff.locationRegion.provinceId = newLocation.provinceId;
    staff.locationRegion.provinceName = newLocation.provinceName;
    staff.locationRegion.districtId = newLocation.districtId;
    staff.locationRegion.districtName = newLocation.districtName;
    staff.locationRegion.wardId = newLocation.wardId;
    staff.locationRegion.wardName = newLocation.wardName;
    staff.locationRegion.address = newLocation.address;

    staff = await this.staffService.saveNoAvatar(staff);

    if (file) {
      staff = await this.staffService.saveWithAvatar(staff, file);
    }
    return staff.toStaffDTO();
  }

  @Patch('/update-yourself/:staffId')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('staffId', ParseIntPipe) staffId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() staffUpdateYourselfDTOPayload: StaffUpdateYourselfDTO,
  ) {
    const staffUpdateYourselfDTO = plainToClass(
      StaffUpdateYourselfDTO,
      staffUpdateYourselfDTOPayload,
    );
    let staff = await this.staffService.findById(staffId);
    if (!staff) {
      throw new HttpException(
        'ID nhân viên không tồn tại.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (
      await this.staffService.existsByPhoneAndIdNot(
        staffUpdateYourselfDTO.phone,
        staffId,
      )
    ) {
      throw new HttpException(
        'Số điện thoại đã tồn tại trong hệ thống.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const locationRegion = staffUpdateYourselfDTO.toLocationRegion();
    locationRegion.id = staff.locationRegion.id;

    staff.fullName = staffUpdateYourselfDTO.fullName;
    staff.phone = staffUpdateYourselfDTO.phone;
    staff.locationRegion = locationRegion;

    staff = await this.staffService.saveWithLocationRegion(staff);
    if (file) {
      staff = await this.staffService.saveWithAvatar(staff, file);
    }

    return staff.toStaffDTO();
  }

  @Delete('/delete/:staffId')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('ADMIN')
  async delete(@Param('staffId', ParseIntPipe) staffId: number) {
    const staff = await this.staffService.findById(staffId);
    if (!staff) {
      throw new HttpException(
        'ID nhân viên không hợp lệ.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (staff.user.role.code === 'ADMIN') {
      throw new HttpException(
        'Không thể xóa nhân viên là ADMIN.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.userService.softDelete(staff.user.id);
    await this.staffService.softDelete(staffId);
    return { status: HttpStatus.ACCEPTED };
  }

  @Patch('/recovery/:staffId')
  //   @UseGuards(JwtAuthGuard, RolesGuard)
  //   @Roles('ADMIN')
  async recovery(@Param('staffId', ParseIntPipe) staffId: number) {
    const staff = await this.staffService.findById(staffId);
    if (!staff) {
      throw new HttpException(
        'ID nhân viên không hợp lệ.',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.staffService.recoveryAccount(staffId);
    await this.userService.recovery(staff.user.id);
    return { status: HttpStatus.ACCEPTED };
  }
}
