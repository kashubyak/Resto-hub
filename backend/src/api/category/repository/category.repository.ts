import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from '../dto/request/create-category.dto';
import { UpdateCategoryDto } from '../dto/request/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCategoryDto, companyId: number) {
    return this.prisma.category.create({ data: { ...dto, companyId } });
  }

  findById(id: number, companyId: number) {
    return this.prisma.category.findFirst({
      where: { id, companyId },
      include: { dishes: true },
    });
  }

  findByName(name: string, companyId: number) {
    return this.prisma.category.findUnique({
      where: { name_companyId: { name, companyId } },
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

  async update(id: number, dto: UpdateCategoryDto, companyId: number) {
    const result = await this.prisma.category.updateMany({
      where: { id, companyId },
      data: dto,
    });
    if (result.count === 0) return null;
    return this.findById(id, companyId);
  }

  async delete(id: number, companyId: number) {
    const result = await this.prisma.category.deleteMany({
      where: { id, companyId },
    });
    if (result.count === 0) return null;
    return { id };
  }
}
