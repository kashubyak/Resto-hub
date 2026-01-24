import { type Category } from '@prisma/client'
import { type IFindManyArgs } from 'src/common/interface/repository.interface'
import { type ICategoryWithDishes } from './category.interface'
import {
	type ICategoryOrderByInput,
	type ICategoryWhereInput,
} from './prisma.interface'

export type { IDeleteResult, IFindManyResult } from 'src/common/interface/repository.interface'

export type IFindCategoriesArgs = IFindManyArgs<
	ICategoryWhereInput,
	ICategoryOrderByInput
>

export type ICategoryRepositoryResult = Category | ICategoryWithDishes | null
