import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(dto: CreateCategoryDto) {
    return await this.prisma.category.create({ data: dto });
  }

  async getAllCategories() {
    return await this.prisma.category.findMany({
      include: { dishes: true },
      orderBy: { createdAt: 'desc' },
    });
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
