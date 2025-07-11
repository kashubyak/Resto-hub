import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDishDto } from '../dto/request/create-dish.dto';
import { FilterDishDto } from '../dto/request/filter-dish.dto';

@Injectable()
export class DishRepository {
  constructor(private readonly prisma: PrismaService) {}

  createDish(data: CreateDishDto & { imageUrl: string }) {
    return this.prisma.dish.create({ data });
  }

  findDishes(query: FilterDishDto) {
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

    const where: Prisma.DishWhereInput = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (available !== undefined) where.available = available;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const skip = (page - 1) * limit;

    return Promise.all([
      this.prisma.dish.findMany({
        where,
        include: { category: true },
        skip,
        take: limit,
        orderBy: { [sortBy]: order },
      }),
      this.prisma.dish.count({ where }),
    ]);
  }

  findById(id: number) {
    return this.prisma.dish.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  updateDish(id: number, dto: Prisma.DishUpdateInput) {
    return this.prisma.dish.update({
      where: { id },
      data: dto,
    });
  }

  deleteDish(id: number) {
    return this.prisma.dish.delete({
      where: { id },
    });
  }

  removeCategory(id: number) {
    return this.prisma.dish.update({
      where: { id },
      data: { categoryId: null },
    });
  }

  assignCategory(id: number, categoryId: number) {
    return this.prisma.dish.update({
      where: { id },
      data: { categoryId },
    });
  }

  findCategoryById(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
    });
  }
}
