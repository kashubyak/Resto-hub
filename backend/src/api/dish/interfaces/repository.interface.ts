import { type Category } from '@prisma/client'
import {
	type IFindManyArgs,
	type IFindManyResult,
} from 'src/common/interface/repository.interface'
import { type IDishWithCategory } from './dish.interface'
import {
	type IDishOrderByInput,
	type IDishWhereInput,
} from './prisma.interface'

export type IFindDishesArgs = IFindManyArgs<IDishWhereInput, IDishOrderByInput>

export type IFindDishesResult = IFindManyResult<IDishWithCategory>

export type IDishRepositoryResult = IDishWithCategory | null

export type ICategoryRepositoryResult = Category | null
