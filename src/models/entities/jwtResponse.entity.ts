import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class JwtResponse {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  type: string = 'Bearer';

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  roles: string[]; // Hoặc sử dụng một loại dữ liệu khác tùy thuộc vào cách bạn quản lý quyền

  constructor(
    accessToken: string,
    id: number,
    username: string,
    name: string,
    roles: string[],
  ) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.name = name;
    this.roles = roles;
  }

  toString(): string {
    return `JwtResponse{id=${this.id}, token='${this.token}', type='${this.type}', username='${this.username}', name='${this.name}', roles=${this.roles}}`;
  }
}
