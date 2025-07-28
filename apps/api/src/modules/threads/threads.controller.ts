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
import { ThreadsService } from './threads.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('threads')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('threads')
export class ThreadsController {
  constructor(private readonly threadsService: ThreadsService) {}

  @ApiOperation({ summary: '创建新线程' })
  @ApiResponse({ status: 201, description: '线程创建成功' })
  @Post()
  create(@Body() createThreadDto: any, @Request() req) {
    return this.threadsService.create(req.user.userId, createThreadDto);
  }

  @ApiOperation({ summary: '获取用户所有线程' })
  @ApiResponse({ status: 200, description: '返回线程列表' })
  @Get()
  findAll(@Request() req) {
    return this.threadsService.findAll(req.user.userId);
  }

  @ApiOperation({ summary: '获取用户统计信息' })
  @ApiResponse({ status: 200, description: '返回用户统计信息' })
  @Get('stats')
  getStats(@Request() req) {
    return this.threadsService.getStats(req.user.userId);
  }

  @ApiOperation({ summary: '获取指定线程' })
  @ApiResponse({ status: 200, description: '返回线程详情' })
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.threadsService.findOne(id, req.user.userId);
  }

  @ApiOperation({ summary: '更新线程' })
  @ApiResponse({ status: 200, description: '线程更新成功' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateThreadDto: any,
    @Request() req,
  ) {
    return this.threadsService.update(id, req.user.userId, updateThreadDto);
  }

  @ApiOperation({ summary: '删除线程' })
  @ApiResponse({ status: 200, description: '线程删除成功' })
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.threadsService.remove(id, req.user.userId);
  }
} 