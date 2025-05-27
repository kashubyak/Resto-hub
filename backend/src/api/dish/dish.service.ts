import { Injectable } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { FilterDishDto } from './dto/filter-dish.dto';
import { UpdateDishDto } from './dto/update-dish.dto';
import { DishRepository } from './repository/dish.repository';

@Injectable()
export class DishService {
  constructor(private readonly dishRepo: DishRepository) {}

  createDish(dto: CreateDishDto) {
    return this.dishRepo.createDish(dto);
  }
  getAllDishes() {
    return this.dishRepo.getAllDishes();
  }
  filterDishes(query: FilterDishDto) {
    return this.dishRepo.filterDishes(query);
  }
  getDishById(id: number) {
    return this.dishRepo.getDishById(id);
  }
  updateDish(id: number, dto: UpdateDishDto) {
    return this.dishRepo.updateDish(id, dto);
  }
  removeDish(id: number) {
    return this.dishRepo.removeDish(id);
  }
  removeDishFromCategory(id: number) {
    return this.dishRepo.removeDishFromCategory(id);
  }
  assignDishToCategory(id: number, categoryId: number) {
    return this.dishRepo.assignDishToCategory(id, categoryId);
  }
}
