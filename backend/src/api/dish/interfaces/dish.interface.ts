import { type Category, type Dish } from '@prisma/client'

export interface IDishWithCategory extends Dish {
	category: Category | null
}
