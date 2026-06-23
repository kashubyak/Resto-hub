import type { IUpdateCompanyFormPayload } from '@/services/company/update-company.service'
import type { OrderStatus } from '@/types/order.interface'

export interface DishAssignCategoryVariables {
	id: number
	categoryId: number
}

export interface OrderUpdateStatusVariables {
	orderId: number
	status: OrderStatus
}

export interface TableCreateVariables {
	number: number
	seats: number
}

export interface TableUpdateVariables {
	id: number
	number: number
	seats: number
}

export interface TableToggleActiveVariables {
	id: number
	active: boolean
}

export type CompanyUpdateVariables = IUpdateCompanyFormPayload
