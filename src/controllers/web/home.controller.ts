import { Controller, Get, Render } from '@nestjs/common';

@Controller('/login')
export class HomeController {
  @Get()
  @Render('login')
  showLoginPage() {
    // Nếu cần truyền dữ liệu vào view, có thể làm như sau:
    // return { someData: 'value' };
    return {};
  }
}
