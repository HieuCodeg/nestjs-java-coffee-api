import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing!');
    }

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // Lưu thông tin người dùng vào request
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token!');
    }
  }

  // Hàm lấy token từ cả cookie và header
  private extractTokenFromRequest(request: Request): string | null {
    // Kiểm tra token từ cookie (admin)
    const tokenFromCookie = request.cookies?.['auth_token'];

    if (tokenFromCookie) {
      return tokenFromCookie;
    }

    // Kiểm tra token từ header (client)
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1]; // Lấy token từ "Bearer <token>"
    }

    // Nếu không tìm thấy token, trả về null
    return null;
  }
}
