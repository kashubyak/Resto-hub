import { type Category, type Dish } from '@prisma/client'

export interface ICategoryWithDishes extends Category {
	dishes: Dish[]
}

export interface ICategoryCreateInput {
	name: string
	companyId: number
}

export interface ICategoryUpdateInput {
	name?: string
}
