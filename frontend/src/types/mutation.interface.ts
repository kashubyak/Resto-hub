import type { IUpdateCompanyFormPayload } from '@/services/company/update-company.service'
import type { OrderStatus } from '@/types/order.interface'

export type DishAssignCategoryVariables = {
	id: number
	categoryId: number
}

export type OrderUpdateStatusVariables = {
	orderId: number
	status: OrderStatus
}

export type TableCreateVariables = {
	number: number
	seats: number
}

export type TableUpdateVariables = {
	id: number
	number: number
	seats: number
}

export type TableToggleActiveVariables = {
	id: number
	active: boolean
}

export type CompanyUpdateVariables = IUpdateCompanyFormPayload
