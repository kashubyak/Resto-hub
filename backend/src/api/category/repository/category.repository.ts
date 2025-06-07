import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

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
    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        include: { dishes: true },
        skip,
        take,
        orderBy,
      }),
      this.prisma.category.count({ where }),
    ]);

    return { items, total };
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
