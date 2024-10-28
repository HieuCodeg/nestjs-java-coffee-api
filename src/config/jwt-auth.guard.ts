import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      // response.redirect('/login');
      // throw new UnauthorizedException('Token is missing!');
      return this.handleUnauthorized(response, request, 'Token is missing!');
    }

    try {
      const decoded = this.jwtService.verify(token);

      request.user = decoded; // Lưu thông tin người dùng vào request
      return true;
    } catch (err) {
      // response.redirect('/login');
      // throw new UnauthorizedException('Invalid token!');
      return this.handleUnauthorized(response, request, 'Invalid token!');
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

  private handleUnauthorized(
    response: Response,
    request: Request,
    message: string,
  ): boolean {
    // Kiểm tra loại yêu cầu (JSON hoặc HTML)
    const acceptHeader = request.headers['accept'];
    // Nếu là request từ client API (JSON)
    if (acceptHeader && acceptHeader.includes('application/json')) {
      response.status(401).json({ message });
      return false;
    }
    // Nếu là request từ trình duyệt (HTML)
    response.redirect('/login');
    return false;
  }
}
