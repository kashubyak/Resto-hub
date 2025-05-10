import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDishDto } from '../dto/create-dish.dto';
import { UpdateDishDto } from '../dto/update-dish.dto';

@Injectable()
export class DishRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDish(dto: CreateDishDto) {
    return await this.prisma.dish.create({ data: dto });
  }
  async findAll() {
    return await this.prisma.dish.findMany({
      include: { Category: true },
    });
  }
  async findOne(id: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: { Category: true },
    });
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }
  async updateDish(id: number, dto: UpdateDishDto) {
    return await this.prisma.dish.update({
      where: { id },
      data: dto,
    });
  }
  async removeDish(id: number) {
    return await this.prisma.dish.delete({
      where: { id },
    });
  }
  async removeDishFromCategory(id: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
    });
    if (!dish) throw new NotFoundException('Dish not found');
    return await this.prisma.dish.update({
      where: { id },
      data: { categoryId: null },
    });
  }
  async assignDishToCategory(id: number, categoryId: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
    });
    if (!dish) throw new NotFoundException('Dish not found');
    return await this.prisma.dish.update({
      where: { id },
      data: { categoryId },
    });
  }
}
