import { Injectable } from '@nestjs/common'
import { Category } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { CreateCategoryDto } from '../dto/request/create-category.dto'
import { UpdateCategoryDto } from '../dto/request/update-category.dto'
import { type ICategoryWithDishes } from '../interfaces/category.interface'
import {
	type IDeleteResult,
	type IFindManyWithCountArgs,
	type IFindManyWithCountResult,
} from '../interfaces/repository.interface'

@Injectable()
export class CategoryRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(dto: CreateCategoryDto, companyId: number): Promise<Category> {
		return this.prisma.category.create({ data: { ...dto, companyId } })
	}

	async findById(
		id: number,
		companyId: number,
	): Promise<ICategoryWithDishes | null> {
		return this.prisma.category.findFirst({
			where: { id, companyId },
			include: { dishes: true },
		})
	}

	async findByName(name: string, companyId: number): Promise<Category | null> {
		return this.prisma.category.findUnique({
			where: { name_companyId: { name, companyId } },
		})
	}

	async findManyWithCount(
		args: IFindManyWithCountArgs,
	): Promise<IFindManyWithCountResult<ICategoryWithDishes>> {
		const { where, orderBy, skip, take } = args
		const [data, total] = await Promise.all([
			this.prisma.category.findMany({
				where,
				include: { dishes: true },
				skip,
				take,
				orderBy,
			}),
			this.prisma.category.count({ where }),
		])

		return { data, total }
	}

	async update(
		id: number,
		dto: UpdateCategoryDto,
		companyId: number,
	): Promise<Category> {
		return this.prisma.category.update({
			where: { id, companyId },
			data: dto,
		})
	}

	async delete(id: number, companyId: number): Promise<IDeleteResult> {
		await this.prisma.category.delete({
			where: { id, companyId },
		})
		return { id }
	}
}
