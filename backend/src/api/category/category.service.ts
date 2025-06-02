import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './repository/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRep: CategoryRepository) {}
  createCategory(dto: CreateCategoryDto) {
    return this.categoryRep.createCategory(dto);
  }
  filterCategories(query: FilterCategoryDto) {
    return this.categoryRep.filterCategories(query);
  }
  getCategoryById(id: number) {
    return this.categoryRep.getCategoryById(id);
  }
  updateCategory(id: number, dto: UpdateCategoryDto) {
    return this.categoryRep.updateCategory(id, dto);
  }
  deleteCategory(id: number) {
    return this.categoryRep.deleteCategory(id);
  }
}
