import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateDishDto } from '../dto/request/create-dish.dto'
import { FilterDishDto } from '../dto/request/filter-dish.dto'

@Injectable()
export class DishRepository {
	constructor(private readonly prisma: PrismaService) {}

	createDish(data: CreateDishDto & { imageUrl: string }, companyId: number) {
		return this.prisma.dish.create({ data: { ...data, companyId } })
	}

	findDishes(query: FilterDishDto, companyId: number) {
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

		const where: Prisma.DishWhereInput = { companyId }
		if (search) where.name = { contains: search, mode: 'insensitive' }
		if (available !== undefined) where.available = available
		if (minPrice !== undefined || maxPrice !== undefined) {
			where.price = {}
			if (minPrice !== undefined) where.price.gte = minPrice
			if (maxPrice !== undefined) where.price.lte = maxPrice
		}

		const skip = (page - 1) * limit

		return Promise.all([
			this.prisma.dish.findMany({
				where,
				include: { category: true },
				skip,
				take: limit,
				orderBy: { [sortBy]: order },
			}),
			this.prisma.dish.count({ where }),
		])
	}

	findById(id: number, companyId: number) {
		return this.prisma.dish.findUnique({
			where: { id, companyId },
			include: { category: true },
		})
	}

	async updateDish(id: number, dto: Prisma.DishUpdateInput, companyId: number) {
		return this.prisma.dish.update({
			where: { id, companyId },
			data: dto,
		})
	}

	async deleteDish(id: number, companyId: number) {
		const dish = await this.findById(id, companyId)
		if (!dish) throw new NotFoundException('Dish not found')
		return this.prisma.dish.delete({
			where: { id, companyId },
		})
	}

	async removeCategory(id: number, companyId: number) {
		return this.prisma.dish.update({
			where: { id, companyId },
			data: { categoryId: null },
		})
	}

	async assignCategory(id: number, categoryId: number, companyId: number) {
		return this.prisma.dish.update({
			where: { id, companyId },
			data: { categoryId },
		})
	}

	findCategoryById(id: number, companyId: number) {
		return this.prisma.category.findFirst({
			where: { id, companyId },
		})
	}
}
