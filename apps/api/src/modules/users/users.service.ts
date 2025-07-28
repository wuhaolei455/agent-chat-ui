import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: any): Promise<any> {
    return (this.prisma as any).user.create({
      data,
    });
  }

  async findAll(): Promise<any[]> {
    return (this.prisma as any).user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        metadata: true,
        // 不返回密码哈希
        passwordHash: false,
      },
    });
  }

  async findOne(id: string): Promise<any | null> {
    return (this.prisma as any).user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        metadata: true,
        // 不返回密码哈希
        passwordHash: false,
      },
    });
  }

  async findByEmail(email: string): Promise<any | null> {
    return (this.prisma as any).user.findUnique({
      where: { email },
    });
  }

  async update(id: string, data: any): Promise<any> {
    return (this.prisma as any).user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        metadata: true,
        // 不返回密码哈希
        passwordHash: false,
      },
    });
  }

  async remove(id: string): Promise<any> {
    return (this.prisma as any).user.delete({
      where: { id },
    });
  }

  async updateLastLogin(id: string): Promise<void> {
    await (this.prisma as any).user.update({
      where: { id },
      data: {
        lastLoginAt: new Date(),
      },
    });
  }
} 