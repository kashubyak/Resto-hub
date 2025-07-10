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

  async createCategory(dto: CreateCategoryDto, companyId: number) {
    const existing = await this.categoryRep.findByName(dto.name, companyId);
    if (existing)
      throw new ConflictException('Category with this name already exists');
    return this.categoryRep.create(dto, companyId);
  }

  async filterCategories(query: FilterCategoryDto, companyId: number) {
    const {
      search,
      hasDishes,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = query;

    const where: Prisma.CategoryWhereInput = { companyId };
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

  async getCategoryById(id: number, companyId: number) {
    const category = await this.categoryRep.findById(id, companyId);
    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto, companyId: number) {
    await this.getCategoryById(id, companyId);

    if (dto.name) {
      const existingByName = await this.categoryRep.findByName(
        dto.name,
        companyId,
      );
      if (existingByName && existingByName.id !== id)
        throw new ConflictException('Category with this name already exists');
    }

    return this.categoryRep.update(id, dto, companyId);
  }

  async deleteCategory(id: number, companyId: number) {
    await this.getCategoryById(id, companyId);
    return this.categoryRep.delete(id, companyId);
  }
}
