import {
  Controller,
  Post,
  UseGuards,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginDto, RegisterDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: '登录成功',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            displayName: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    
    return this.authService.login(user);
  }

  @ApiOperation({ summary: '用户注册' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: '注册成功',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            username: { type: 'string' },
            displayName: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.authService.register(
        registerDto.email,
        registerDto.password,
        registerDto.username,
        registerDto.displayName,
      );
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException(
          'Email or username already exists',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        'Registration failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 