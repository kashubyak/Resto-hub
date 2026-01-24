import { Category } from '@prisma/client'
import { type ICategoryWithDishes } from './category.interface'
import { type ICategoryOrderByInput, type ICategoryWhereInput } from './prisma.interface'

export interface IFindManyWithCountArgs {
	where: ICategoryWhereInput
	orderBy: ICategoryOrderByInput
	skip: number
	take: number
}

export interface IFindManyWithCountResult<T> {
	data: T[]
	total: number
}

export interface IDeleteResult {
	id: number
}

export type ICategoryRepositoryResult = Category | ICategoryWithDishes | null
