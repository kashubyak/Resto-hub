import { Injectable, NotFoundException } from '@nestjs/common'
import { Dish } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateDishDto } from '../dto/request/create-dish.dto'
import { FilterDishDto } from '../dto/request/filter-dish.dto'
import {
	type IDishSortBy,
	type IDishUpdateInput,
	type IDishWhereInput,
	type IOrderDirection,
} from '../interfaces/prisma.interface'
import {
	type ICategoryRepositoryResult,
	type IDishRepositoryResult,
	type IFindDishesResult,
} from '../interfaces/repository.interface'

@Injectable()
export class DishRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createDish(
		data: CreateDishDto & { imageUrl: string },
		companyId: number,
	): Promise<Dish> {
		return this.prisma.dish.create({ data: { ...data, companyId } })
	}

	async findDishes(
		query: FilterDishDto,
		companyId: number,
	): Promise<IFindDishesResult> {
		const {
			search,
			minPrice,
			maxPrice,
			available,
			sortBy = 'createdAt',
			order = 'desc',
			page = 1,
			limit = 10,
		} = query

		const where: IDishWhereInput = { companyId }
		if (search) where.name = { contains: search, mode: 'insensitive' }
		if (available !== undefined) where.available = available
		if (minPrice !== undefined || maxPrice !== undefined) {
			where.price = {}
			if (minPrice !== undefined) where.price.gte = minPrice
			if (maxPrice !== undefined) where.price.lte = maxPrice
		}

		const skip = (page - 1) * limit

		const typedSortBy = sortBy as IDishSortBy
		const typedOrder = order as IOrderDirection

		let orderBy:
			| { name: IOrderDirection }
			| { price: IOrderDirection }
			| { createdAt: IOrderDirection }

		if (typedSortBy === 'name') orderBy = { name: typedOrder }
		else if (typedSortBy === 'price') orderBy = { price: typedOrder }
		else orderBy = { createdAt: typedOrder }

		const [data, total] = await Promise.all([
			this.prisma.dish.findMany({
				where,
				include: { category: true },
				skip,
				take: limit,
				orderBy,
			}),
			this.prisma.dish.count({ where }),
		])

		return { data, total }
	}

	async findById(
		id: number,
		companyId: number,
	): Promise<IDishRepositoryResult> {
		return this.prisma.dish.findUnique({
			where: { id, companyId },
			include: { category: true },
		})
	}

	async updateDish(
		id: number,
		dto: IDishUpdateInput,
		companyId: number,
	): Promise<Dish> {
		return this.prisma.dish.update({
			where: { id, companyId },
			data: dto,
		})
	}

	async deleteDish(id: number, companyId: number): Promise<Dish> {
		const dish = await this.findById(id, companyId)
		if (!dish) throw new NotFoundException('Dish not found')
		return this.prisma.dish.delete({
			where: { id, companyId },
		})
	}

	async removeCategory(id: number, companyId: number): Promise<Dish> {
		return this.prisma.dish.update({
			where: { id, companyId },
			data: { categoryId: null },
		})
	}

	async assignCategory(
		id: number,
		categoryId: number,
		companyId: number,
	): Promise<Dish> {
		return this.prisma.dish.update({
			where: { id, companyId },
			data: { categoryId },
		})
	}

	async findCategoryById(
		id: number,
		companyId: number,
	): Promise<ICategoryRepositoryResult> {
		return this.prisma.category.findFirst({
			where: { id, companyId },
		})
	}
}
