// import { Controller, Get, Render, Param } from '@nestjs/common';
// import { User } from 'src/models/entities/user.entity';

// @Controller('/cp')
// export class CPController {
//   constructor(
//     private readonly userService: UserService,
//     private readonly appUtils: AppUtils,
//     private readonly staffService: StaffService,
//   ) {}

//   @Get()
//   @Render('cp/index') // Render template 'cp/index'
//   async showIndexPage() {
//     const staffDTO: StaffDTO = await this.staffService.getByUsernameDTO(
//       this.appUtils.getUserName(),
//     );
//     return { staff: staffDTO };
//   }

//   @Get('/login')
//   @Render('login') // Render template 'login'
//   showLoginPage() {
//     return;
//   }

//   @Get('/forget-password')
//   @Render('forget-password') // Render template 'forget-password'
//   showForgetPasswordPage() {
//     return;
//   }

//   @Get('/update-password/:codeFirstLogin')
//   async showUpdatePasswordPage(
//     @Param('codeFirstLogin') codeFirstLogin: string,
//   ) {
//     const user: User =
//       await this.userService.findByCodeFirstLogin(codeFirstLogin);

//     if (user && user.isFirstLogin && !user.deleted) {
//       return { view: 'update-password' };
//     }

//     return { view: 'error/expired-page' };
//   }
// }
