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

  async createDish(
    dto: CreateDishDto,
    file: Express.Multer.File,
    companyId: number,
  ) {
    if (!file) throw new BadRequestException('Dish image is required');
    const imageUrl = await this.s3Service.uploadFile(file, folder_dish);

    return this.dishRepo.createDish({ ...dto, imageUrl }, companyId);
  }
  async filterDishes(query: FilterDishDto, companyId: number) {
    const [data, total] = await this.dishRepo.findDishes(query, companyId);
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

  async getDishById(id: number, companyId: number) {
    const dish = await this.dishRepo.findById(id, companyId);
    if (!dish) throw new NotFoundException('Dish not found');
    return dish;
  }

  async updateDish(
    id: number,
    dto: UpdateDishDto,
    file: Express.Multer.File,
    companyId: number,
  ) {
    const dish = await this.dishRepo.findById(id, companyId);
    if (!dish) throw new NotFoundException('Dish not found');
    let imageUrl = dish.imageUrl;
    if (file) {
      if (imageUrl) await this.s3Service.deleteFile(imageUrl);
      imageUrl = await this.s3Service.uploadFile(file, folder_dish);
    }
    return this.dishRepo.updateDish(id, { ...dto, imageUrl }, companyId);
  }

  async removeDish(id: number, companyId: number) {
    const dish = await this.dishRepo.findById(id, companyId);
    if (!dish) throw new NotFoundException('Dish not found');
    if (dish.imageUrl) {
      try {
        await this.s3Service.deleteFile(dish.imageUrl);
      } catch (error) {
        throw new BadRequestException('Failed to delete dish image');
      }
    }
    return this.dishRepo.deleteDish(id, companyId);
  }

  async removeDishFromCategory(id: number, companyId: number) {
    const dish = await this.dishRepo.findById(id, companyId);
    if (!dish) throw new NotFoundException('Dish not found');
    return this.dishRepo.removeCategory(id, companyId);
  }

  async assignDishToCategory(
    id: number,
    categoryId: number,
    companyId: number,
  ) {
    const dish = await this.dishRepo.findById(id, companyId);
    if (!dish) throw new NotFoundException('Dish not found');
    const category = await this.dishRepo.findCategoryById(
      categoryId,
      companyId,
    );
    if (!category)
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    return this.dishRepo.assignCategory(id, categoryId, companyId);
  }
}
