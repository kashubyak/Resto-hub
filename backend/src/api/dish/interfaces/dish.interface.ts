import { type Category, type Dish } from '@prisma/client'

export interface IDishBasic {
	id: number
	name: string
	price: number
}

export interface IDishFull {
	id: number
	name: string
	description: string
	price: number
	imageUrl: string
	ingredients: string[]
	weightGr: number | null
	calories: number | null
	available: boolean
}

export interface IDishWithCategory extends Dish {
	category: Category | null
}
