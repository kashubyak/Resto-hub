import { Injectable } from '@nestjs/common';
import { CreateDishDto } from './dto/create-dish.dto';
import { Dish } from './entities/dish.entity';
import { DishRepository } from './repository/dish.repository';

@Injectable()
export class DishService {
  constructor(private readonly dishRepo: DishRepository) {}

  createDish(dto: CreateDishDto): Promise<Dish> {
    return this.dishRepo.createDish(dto);
  }
  findAll(): Promise<Dish[]> {
    return this.dishRepo.findAll();
  }
  findOne(id: number): Promise<Dish> {
    return this.dishRepo.findOne(id);
  }
  updateDish(id: number, dto: CreateDishDto): Promise<Dish> {
    return this.dishRepo.updateDish(id, dto);
  }
  removeDish(id: number): Promise<Dish> {
    return this.dishRepo.removeDish(id);
  }
}
