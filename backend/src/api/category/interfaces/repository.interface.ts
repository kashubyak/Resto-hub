import { type Category } from '@prisma/client'
import {
	type IFindManyArgs,
	type IFindManyResult,
} from 'src/common/interface/repository.interface'
import { type ICategoryWithDishes } from './category.interface'
import {
	type ICategoryOrderByInput,
	type ICategoryWhereInput,
} from './prisma.interface'

export type { IDeleteResult } from 'src/common/interface/repository.interface'

export type IFindManyWithCountArgs = IFindManyArgs<
	ICategoryWhereInput,
	ICategoryOrderByInput
>

export type IFindManyWithCountResult<T> = IFindManyResult<T>

export type ICategoryRepositoryResult = Category | ICategoryWithDishes | null
