import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDishDto } from './dto/request/create-dish.dto';
import { FilterDishDto } from './dto/request/filter-dish.dto';
import { UpdateDishDto } from './dto/request/update-dish.dto';
import { DishRepository } from './repository/dish.repository';

@Injectable()
export class DishService {
  constructor(private readonly dishRepo: DishRepository) {}

  async createDish(dto: CreateDishDto) {
    return this.dishRepo.createDish(dto);
  }

  async filterDishes(query: FilterDishDto) {
    const [data, total] = await this.dishRepo.findDishes(query);
    const page = query.page || 1;
    const limit = query.limit || 10;

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getDishById(id: number) {
    const dish = await this.dishRepo.findById(id);
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }

  async updateDish(id: number, dto: UpdateDishDto) {
    await this.ensureDishExists(id);
    return this.dishRepo.updateDish(id, dto);
  }

  async removeDish(id: number) {
    await this.ensureDishExists(id);
    return this.dishRepo.deleteDish(id);
  }

  async removeDishFromCategory(id: number) {
    await this.ensureDishExists(id);
    return this.dishRepo.removeCategory(id);
  }

  async assignDishToCategory(id: number, categoryId: number) {
    await this.ensureDishExists(id);
    const category = await this.dishRepo.findCategoryById(categoryId);
    if (!category)
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    return this.dishRepo.assignCategory(id, categoryId);
  }

  private async ensureDishExists(id: number) {
    const dish = await this.dishRepo.findById(id);
    if (!dish) throw new NotFoundException('Dish not found');
  }
}
