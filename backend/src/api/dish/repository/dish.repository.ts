import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDishDto } from '../dto/create-dish.dto';
import { FilterDishDto } from '../dto/filter-dish.dto';
import { UpdateDishDto } from '../dto/update-dish.dto';

@Injectable()
export class DishRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createDish(dto: CreateDishDto) {
    return await this.prisma.dish.create({ data: dto });
  }

  async filterDishes(query: FilterDishDto) {
    const {
      search,
      minPrice,
      maxPrice,
      available,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: any = {};

    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (available !== undefined) where.available = available;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.dish.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: {
          [sortBy]: order,
        },
      }),
      this.prisma.dish.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDishById(id: number) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: { category: true },
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
    const categoryExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!categoryExists)
      throw new NotFoundException(`Category with ID ${categoryId} not found`);

    return await this.prisma.dish.update({
      where: { id },
      data: { categoryId },
    });
  }
}
