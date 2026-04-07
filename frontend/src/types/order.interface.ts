import type { IPaginatedResponse } from '@/types/api.interface'

export type OrderStatus =
	| 'PENDING'
	| 'IN_PROGRESS'
	| 'COMPLETE'
	| 'CANCELED'
	| 'DELIVERED'
	| 'FINISHED'

export type WaiterOrdersPhase = 'active' | 'history'

export interface IOrderDishBasic {
	id: number
	name: string
	price: number
}

export interface IOrderItemSummary {
	price: number
	quantity: number
	total: number
	notes?: string
	dish: IOrderDishBasic
}

export interface IOrderUserSummary {
	id: number
	name: string
	email?: string
	role?: string
}

export interface IOrderTableSummary {
	id: number
	number: number
	seats?: number
	active?: boolean
}

export interface IOrderSummary {
	id: number
	status: OrderStatus
	createdAt: string
	updatedAt: string
	total: number
	waiter?: IOrderUserSummary | null
	cook?: IOrderUserSummary | null
	table?: IOrderTableSummary | null
	orderItems: IOrderItemSummary[]
}

export type IWaiterOrdersListResponse = IPaginatedResponse<IOrderSummary>

export interface ICreateOrderItemRequest {
	dishId: number
	quantity: number
	notes?: string
}

export interface ICreateOrderRequest {
	tableId: number
	items: ICreateOrderItemRequest[]
}

export interface ICreateOrderResponse {
	id: number
	waiterId: number
	cookId: number | null
	status: OrderStatus
	tableId: number
	orderItems: Array<{
		id?: number
		dishId: number
		quantity: number
		price: number
		notes?: string | null
	}>
	createdAt: string
	updatedAt: string
}

export interface IUpdateOrderStatusRequest {
	status: OrderStatus
}

export interface IOrderMutationResponse {
	id: number
	waiterId: number
	cookId: number | null
	status: OrderStatus
	tableId: number
	createdAt: string
	updatedAt: string
}

export interface IGetWaiterMyOrdersParams {
	phase?: WaiterOrdersPhase
	page?: number
	limit?: number
	status?: OrderStatus
	sortBy?: 'createdAt'
	order?: 'asc' | 'desc'
}

export type IGetCookMyOrdersParams = IGetWaiterMyOrdersParams

export interface IGetFreeOrdersParams {
	page?: number
	limit?: number
	status?: OrderStatus
	sortBy?: 'createdAt'
	order?: 'asc' | 'desc'
	from?: string
	to?: string
	waiterId?: number
	cookId?: number
	tableId?: number
	search?: string
}
