import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDishDto } from '../dto/create-dish.dto';
import { Dish } from '../entities/dish.entity';

@Injectable()
export class DishRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDish(dto: CreateDishDto): Promise<Dish> {
    return await this.prisma.dish.create({ data: dto });
  }
  async findAll(): Promise<Dish[]> {
    return await this.prisma.dish.findMany({
      include: { Category: true },
    });
  }
  async findOne(id: number): Promise<Dish> {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: { Category: true },
    });
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }
  async updateDish(id: number, dto: CreateDishDto): Promise<Dish> {
    return await this.prisma.dish.update({
      where: { id },
      data: dto,
    });
  }
  async removeDish(id: number): Promise<Dish> {
    return await this.prisma.dish.delete({
      where: { id },
    });
  }
}
