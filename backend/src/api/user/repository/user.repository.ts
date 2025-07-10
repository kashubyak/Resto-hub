import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  createUser(data: Prisma.UserUncheckedCreateInput, companyId: number) {
    return this.prisma.user.create({
      data: {
        ...data,
        companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        companyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findManyWithCount(args: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    const { where, orderBy, skip, take } = args;
    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatarUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, total };
  }

  findUser(id: number, companyId: number) {
    return this.prisma.user.findFirst({
      where: { id, companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUser(
    id: number,
    data: Prisma.UserUpdateInput,
    companyId: number,
  ) {
    const result = await this.prisma.user.updateMany({
      where: { id, companyId },
      data,
    });
    if (result.count === 0) return null;
    return this.findUser(id, companyId);
  }

  findUserWithPassword(id: number, companyId: number) {
    return this.prisma.user.findFirst({
      where: { id, companyId },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        avatarUrl: true,
      },
    });
  }

  findByEmail(email: string, companyId: number) {
    return this.prisma.user.findUnique({
      where: {
        email_companyId: {
          email,
          companyId,
        },
      },
    });
  }

  async deleteUser(id: number, companyId: number) {
    const user = await this.findUser(id, companyId);
    if (!user) return null;
    const result = await this.prisma.user.deleteMany({
      where: { id, companyId },
    });
    if (result.count === 0) return null;
    return user;
  }
}
