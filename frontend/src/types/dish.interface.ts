import type { ICategory } from './category.interface'

export interface IFormValues {
	name: string
	description: string
	price: number
	categoryId?: number | null
	ingredients: string[]
	imageUrl: FileList
	weightGr?: number | null
	calories?: number | null
	available?: boolean
}

export interface IDish {
	id: number
	name: string
	description: string
	price: number
	categoryId: number | null
	ingredients: string[]
	imageUrl: string
	weightGr: number
	calories: number
	available: boolean
	createdAt: string
	updatedAt: string
	companyId: number
	category?: ICategory | null
}

export interface IDishResponse {
	data: IDish[]
	total: number
	page: number
	limit: number
	totalPages: number
}
