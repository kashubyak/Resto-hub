import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: dto });
  }

  async findById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { dishes: true },
    });
  }

  async findByName(name: string) {
    return this.prisma.category.findUnique({
      where: { name },
    });
  }

  async findManyWithCount(args: {
    where: Prisma.CategoryWhereInput;
    orderBy: Prisma.CategoryOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    const { where, orderBy, skip, take } = args;
    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        include: { dishes: true },
        skip,
        take,
        orderBy,
      }),
      this.prisma.category.count({ where }),
    ]);

    return { data, total };
  }

  async update(id: number, dto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
