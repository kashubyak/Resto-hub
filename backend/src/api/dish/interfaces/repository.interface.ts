import { type Category } from '@prisma/client'
import { type IDishWithCategory } from './dish.interface'
import { type IDishOrderByInput, type IDishWhereInput } from './prisma.interface'

export interface IFindDishesArgs {
	where: IDishWhereInput
	orderBy: IDishOrderByInput
	skip: number
	take: number
}

export interface IFindDishesResult {
	data: IDishWithCategory[]
	total: number
}

export type IDishRepositoryResult = IDishWithCategory | null

export type ICategoryRepositoryResult = Category | null
