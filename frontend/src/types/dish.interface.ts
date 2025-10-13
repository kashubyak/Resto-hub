import type { IPaginatedResponse } from './api.interface'
import type { ICategory } from './category.interface'

export interface ICreateDishRequest {
	name: string
	description: string
	price: number
	categoryId?: number | null
	ingredients: string[]
	image: File
	weightGr?: number | null
	calories?: number | null
	available: boolean
}

export interface IUpdateDishRequest extends Partial<ICreateDishRequest> {
	id: number
}

export interface IDish {
	id: number
	name: string
	description: string
	price: number
	categoryId: number | null
	ingredients: string[]
	imageUrl: string
	weightGr: number | null
	calories: number | null
	available: boolean
	createdAt: string
	updatedAt: string
	companyId: number
	category?: ICategory | null
}

export interface ICreateDishResponse {
	data: IDish
	message: string
}

export interface IUpdateDishResponse {
	data: IDish
	message: string
}

export interface IDeleteDishResponse {
	message: string
}

export type IDishListResponse = IPaginatedResponse<IDish>

export interface IDishFormValues {
	name: string
	description: string
	price: number
	categoryId?: number | null
	ingredients: string[]
	imageUrl: FileList
	weightGr?: number | null
	calories?: number | null
	available: boolean
}

export interface IGetAllDishesParams {
	page?: number
	limit?: number
	search?: string
	minPrice?: number
	maxPrice?: number
	available?: boolean
	sortBy?: string
	order?: 'asc' | 'desc'
}

export interface IUpdateDishPayload {
	id: number
	name?: string
	description?: string
	price?: number
	categoryId?: number | null
	ingredients?: string[]
	image?: File
	weightGr?: number | null
	calories?: number | null
	available?: boolean
}
