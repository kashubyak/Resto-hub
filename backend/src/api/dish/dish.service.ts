import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { folder_dish } from 'src/common/constants';
import { S3Service } from 'src/common/s3/s3.service';
import { CreateDishDto } from './dto/request/create-dish.dto';
import { FilterDishDto } from './dto/request/filter-dish.dto';
import { UpdateDishDto } from './dto/request/update-dish.dto';
import { DishRepository } from './repository/dish.repository';

@Injectable()
export class DishService {
  constructor(
    private readonly dishRepo: DishRepository,
    private readonly s3Service: S3Service,
  ) {}

  async createDish(dto: CreateDishDto, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Dish image is required');
    const imageUrl = await this.s3Service.uploadFile(file, folder_dish);

    return this.dishRepo.createDish({ ...dto, imageUrl });
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

  async updateDish(id: number, dto: UpdateDishDto, file: Express.Multer.File) {
    const dish = await this.dishRepo.findById(id);
    if (!dish) throw new NotFoundException('Dish not found');
    let imageUrl = dish.imageUrl;
    if (file) {
      if (imageUrl) await this.s3Service.deleteFile(imageUrl);
      imageUrl = await this.s3Service.uploadFile(file, folder_dish);
    }
    return this.dishRepo.updateDish(id, { ...dto, imageUrl });
  }

  async removeDish(id: number) {
    const dish = await this.dishRepo.findById(id);
    if (!dish) throw new NotFoundException('Dish not found');
    return this.dishRepo.deleteDish(id);
  }

  async removeDishFromCategory(id: number) {
    const dish = await this.dishRepo.findById(id);
    if (!dish) throw new NotFoundException('Dish not found');
    return this.dishRepo.removeCategory(id);
  }

  async assignDishToCategory(id: number, categoryId: number) {
    const dish = await this.dishRepo.findById(id);
    if (!dish) throw new NotFoundException('Dish not found');
    const category = await this.dishRepo.findCategoryById(categoryId);
    if (!category)
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    return this.dishRepo.assignCategory(id, categoryId);
  }
}
