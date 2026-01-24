import {
	type Order,
	type OrderItem,
	type OrderStatus,
	type Table,
	type User,
} from '@prisma/client'
import {
	type IDishBasic,
	type IDishFull,
	type IDishWithCategory,
} from 'src/api/dish/interfaces/dish.interface'
import {
	type IBaseTable,
	type IExtendedTable,
} from 'src/common/interface/table.interface'
import {
	type IBaseUser,
	type IExtendedUser,
} from 'src/common/interface/user.interface'

export interface IOrderItemWithBasicDish {
	quantity: number
	price: number
	notes: string | null
	dish: IDishBasic
}

export interface IOrderItemWithFullDish {
	quantity: number
	price: number
	notes: string | null
	dish: IDishFull
}

export interface IOrderItemWithDishAndCategory extends OrderItem {
	dish: IDishWithCategory
}

export interface IOrderWithRelations extends Order {
	waiter: IBaseUser
	cook: IBaseUser | null
	table: IBaseTable | null
	orderItems: IOrderItemWithBasicDish[]
}

export interface IOrderWithFullDetails {
	id: number
	status: OrderStatus
	createdAt: Date
	updatedAt: Date
	waiter: IExtendedUser | null
	cook: IExtendedUser | null
	table: IExtendedTable | null
	orderItems: IOrderItemWithFullDish[]
}

export interface IOrderWithItemsForAnalytics extends Order {
	waiter: User
	cook: User | null
	table: Table | null
	orderItems: IOrderItemWithDishAndCategory[]
}

export interface IOrderItemSummary {
	price: number
	quantity: number
	total: number
	notes: string | null
	dish: IDishBasic
}

export interface IOrderSummary {
	id: number
	status: OrderStatus
	createdAt: Date
	updatedAt: Date
	total: number
	waiter: IBaseUser | null
	cook: IBaseUser | null
	table: IBaseTable | null
	orderItems: IOrderItemSummary[]
}
