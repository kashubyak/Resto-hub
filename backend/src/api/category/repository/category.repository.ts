import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { FilterCategoryDto } from '../dto/filter-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    return await this.prisma.category.create({ data: dto });
  }

  async filterCategories(query: FilterCategoryDto) {
    const {
      search,
      hasDishes,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (hasDishes === true) where.dishes = { some: {} };
    else if (hasDishes === false) where.dishes = { none: {} };
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        where,
        include: { dishes: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.category.count({ where }),
    ]);
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { dishes: true },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Category not found');
    return await this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async deleteCategory(id: number) {
    const exists = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!exists) throw new NotFoundException('Category not found');
    return await this.prisma.category.delete({ where: { id } });
  }
}
