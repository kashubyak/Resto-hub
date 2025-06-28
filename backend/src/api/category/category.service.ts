import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateCategoryDto } from './dto/request/create-category.dto';
import { FilterCategoryDto } from './dto/request/filter-category.dto';
import { UpdateCategoryDto } from './dto/request/update-category.dto';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRep: CategoryRepository) {}

  async createCategory(dto: CreateCategoryDto) {
    const existing = await this.categoryRep.findByName(dto.name);
    if (existing)
      throw new ConflictException('Category with this name already exists');
    return this.categoryRep.create(dto);
  }

  async filterCategories(query: FilterCategoryDto) {
    const {
      search,
      hasDishes,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: Prisma.CategoryWhereInput = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };

    if (hasDishes === true) where.dishes = { some: {} };
    else if (hasDishes === false) where.dishes = { none: {} };

    const skip = (page - 1) * limit;

    const { data, total } = await this.categoryRep.findManyWithCount({
      where,
      orderBy: { [sortBy]: order },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRep.findById(id);
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    await this.getCategoryById(id);

    if (dto.name) {
      const existingByName = await this.categoryRep.findByName(dto.name);
      if (existingByName && existingByName.id !== id)
        throw new ConflictException('Category with this name already exists');
    }

    return this.categoryRep.update(id, dto);
  }

  async deleteCategory(id: number) {
    await this.getCategoryById(id);
    return this.categoryRep.delete(id);
  }
}
