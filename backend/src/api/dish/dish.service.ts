import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { Dish } from '@prisma/client'
import { folder_dish } from 'src/common/constants'
import { S3Service } from 'src/common/s3/s3.service'
import { type IPaginatedResponse } from '../category/interfaces/pagination.interface'
import { CreateDishDto } from './dto/request/create-dish.dto'
import { FilterDishDto } from './dto/request/filter-dish.dto'
import { UpdateDishDto } from './dto/request/update-dish.dto'
import { type IDishWithCategory } from './interfaces/dish.interface'
import { type IDishImageFile } from './interfaces/file-upload.interface'
import { type IDishUpdateInput } from './interfaces/prisma.interface'
import { DishRepository } from './repository/dish.repository'

@Injectable()
export class DishService {
	constructor(
		private readonly dishRepo: DishRepository,
		private readonly s3Service: S3Service,
	) {}

	async createDish(
		dto: CreateDishDto,
		file: IDishImageFile,
		companyId: number,
	): Promise<Dish> {
		if (!file) throw new BadRequestException('Dish image is required')
		const imageUrl = await this.s3Service.uploadFile(file, folder_dish)

		return this.dishRepo.createDish({ ...dto, imageUrl }, companyId)
	}
	async filterDishes(
		query: FilterDishDto,
		companyId: number,
	): Promise<IPaginatedResponse<IDishWithCategory>> {
		const { data, total } = await this.dishRepo.findDishes(query, companyId)
		const page = query.page ?? 1
		const limit = query.limit ?? 10

		return {
			data,
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	async getDishById(
		id: number,
		companyId: number,
	): Promise<IDishWithCategory> {
		const dish = await this.dishRepo.findById(id, companyId)
		if (!dish) throw new NotFoundException('Dish not found')
		return dish
	}

	async updateDish(
		id: number,
		dto: UpdateDishDto,
		file: IDishImageFile,
		companyId: number,
	): Promise<Dish> {
		const dish = await this.dishRepo.findById(id, companyId)
		if (!dish) throw new NotFoundException('Dish not found')
		let imageUrl = dish.imageUrl
		if (file) {
			if (imageUrl) await this.s3Service.deleteFile(imageUrl)
			imageUrl = await this.s3Service.uploadFile(file, folder_dish)
		}

		const updateData: IDishUpdateInput & { categoryId?: number | null } = {
			imageUrl,
		}

		if (dto.name !== undefined) updateData.name = dto.name
		if (dto.description !== undefined) updateData.description = dto.description
		if (dto.price !== undefined) updateData.price = dto.price
		if (dto.categoryId !== undefined) updateData.categoryId = dto.categoryId
		if (dto.ingredients !== undefined) updateData.ingredients = dto.ingredients
		if (dto.weightGr !== undefined) updateData.weightGr = dto.weightGr
		if (dto.calories !== undefined) updateData.calories = dto.calories
		if (dto.available !== undefined) updateData.available = dto.available

		return this.dishRepo.updateDish(id, updateData as IDishUpdateInput, companyId)
	}

	async removeDish(id: number, companyId: number): Promise<Dish> {
		const dish = await this.dishRepo.findById(id, companyId)
		if (!dish) throw new NotFoundException('Dish not found')
		if (dish.imageUrl) {
			try {
				await this.s3Service.deleteFile(dish.imageUrl)
			} catch {
				throw new BadRequestException('Failed to delete dish image')
			}
		}
		return this.dishRepo.deleteDish(id, companyId)
	}

	async removeDishFromCategory(id: number, companyId: number): Promise<Dish> {
		const dish = await this.dishRepo.findById(id, companyId)
		if (!dish) throw new NotFoundException('Dish not found')
		return this.dishRepo.removeCategory(id, companyId)
	}

	async assignDishToCategory(
		id: number,
		categoryId: number,
		companyId: number,
	): Promise<Dish> {
		const dish = await this.dishRepo.findById(id, companyId)
		if (!dish) throw new NotFoundException('Dish not found')
		const category = await this.dishRepo.findCategoryById(categoryId, companyId)
		if (!category)
			throw new NotFoundException(`Category with ID ${categoryId} not found`)
		return this.dishRepo.assignCategory(id, categoryId, companyId)
	}
}
