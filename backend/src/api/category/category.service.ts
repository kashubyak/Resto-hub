import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Category } from '@prisma/client'
import { type IPaginatedResponse } from 'src/common/interface/pagination.interface'
import { type IOrderDirection } from 'src/common/interface/prisma.interface'
import { CreateCategoryDto } from './dto/request/create-category.dto'
import { FilterCategoryDto } from './dto/request/filter-category.dto'
import { UpdateCategoryDto } from './dto/request/update-category.dto'
import { type ICategoryWithDishes } from './interfaces/category.interface'
import {
	type ICategorySortBy,
	type ICategoryWhereInput,
} from './interfaces/prisma.interface'
import { CategoryRepository } from './repository/category.repository'

@Injectable()
export class CategoryService {
	constructor(private readonly categoryRep: CategoryRepository) { }

	async createCategory(
		dto: CreateCategoryDto,
		companyId: number,
	): Promise<Category> {
		const existing = await this.categoryRep.findByName(dto.name, companyId)
		if (existing)
			throw new ConflictException('Category with this name already exists')
		return this.categoryRep.create(dto, companyId)
	}

	async filterCategories(
		query: FilterCategoryDto,
		companyId: number,
	): Promise<IPaginatedResponse<ICategoryWithDishes>> {
		const { search, hasDishes, sortBy = 'createdAt', order = 'desc' } = query
		const page = query.page ?? 1
		const limit = query.limit ?? 10
		const where: ICategoryWhereInput = { companyId }
		if (search) where.name = { contains: search, mode: 'insensitive' }

		if (hasDishes === true) where.dishes = { some: {} }
		else if (hasDishes === false) where.dishes = { none: {} }

		const skip = (page - 1) * limit

		const typedSortBy = sortBy as ICategorySortBy
		const typedOrder = order as IOrderDirection

		let orderBy:
			| { name: IOrderDirection }
			| { createdAt: IOrderDirection }
			| { updatedAt: IOrderDirection }

		if (typedSortBy === 'name') {
			orderBy = { name: typedOrder }
		} else if (typedSortBy === 'createdAt') {
			orderBy = { createdAt: typedOrder }
		} else {
			orderBy = { updatedAt: typedOrder }
		}

		const { data, total } = await this.categoryRep.findManyWithCount({
			where,
			orderBy,
			skip,
			take: limit,
		})

		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	async getCategoryById(
		id: number,
		companyId: number,
	): Promise<ICategoryWithDishes> {
		const category = await this.categoryRep.findById(id, companyId)
		if (!category)
			throw new NotFoundException(`Category with id ${id} not found`)
		return category
	}

	async updateCategory(
		id: number,
		dto: UpdateCategoryDto,
		companyId: number,
	): Promise<Category> {
		await this.getCategoryById(id, companyId)

		if (dto.name) {
			const existingByName = await this.categoryRep.findByName(
				dto.name,
				companyId,
			)
			if (existingByName && existingByName.id !== id)
				throw new ConflictException('Category with this name already exists')
		}
		return this.categoryRep.update(id, dto, companyId)
	}

	async deleteCategory(
		id: number,
		companyId: number,
	): Promise<ICategoryWithDishes> {
		const category = await this.categoryRep.findById(id, companyId)
		if (!category) throw new NotFoundException('Category not found')
		await this.categoryRep.delete(id, companyId)
		return category
	}
}
