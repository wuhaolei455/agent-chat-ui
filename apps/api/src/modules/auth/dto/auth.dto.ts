import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: '邮箱地址', example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RegisterDto extends LoginDto {
  @ApiProperty({ description: '用户名', example: 'johndoe', required: false })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ description: '显示名称', example: 'John Doe', required: false })
  @IsOptional()
  @IsString()
  displayName?: string;
} 