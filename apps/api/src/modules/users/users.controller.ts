import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '获取所有用户' })
  @ApiResponse({ status: 200, description: '返回用户列表' })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: '获取当前用户信息' })
  @ApiResponse({ status: 200, description: '返回当前用户信息' })
  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user.userId);
  }

  @ApiOperation({ summary: '根据ID获取用户' })
  @ApiResponse({ status: 200, description: '返回用户信息' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse({ status: 200, description: '返回更新后的用户信息' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: '删除用户' })
  @ApiResponse({ status: 200, description: '用户删除成功' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
} 