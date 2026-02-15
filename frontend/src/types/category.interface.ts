import type { IPaginatedResponse } from './api.interface'
import type { IDish } from './dish.interface'

export interface ICategory {
	id: number
	name: string
	createdAt: string
	updatedAt: string
}

export interface ICategoryWithDishes extends ICategory {
	dishes: IDish[]
}

export type ICategoryListResponse = IPaginatedResponse<ICategoryWithDishes>

export interface IGetAllCategoriesParams {
	page?: number
	limit?: number
	search?: string
	hasDishes?: boolean
	sortBy?: string
	order?: 'asc' | 'desc'
}

export interface ICategoryFormValues {
	name: string
}

export interface ICreateCategoryResponse {
	category: ICategory
}
