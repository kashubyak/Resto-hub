export const DISHES_QUERY_KEY = {
	ALL: 'dishes',
	DETAIL: 'dish',
}
export const CATEGORIES_QUERY_KEY = {
	ALL: 'categories',
	DETAIL: 'category',
}
export const COMPANY_QUERY_KEY = {
	CURRENT: 'company',
} as const

export const USERS_QUERY_KEY = {
	ALL: 'users',
	DETAIL: 'user',
} as const

export const LIMIT = 10

const ORDER_DETAIL_KEY = 'order' as const

const ORDER_ANALYTICS_KEY = 'order-analytics' as const
const ORDER_ADMIN_LIST_KEY = 'order-admin-list' as const

export const ORDER_QUERY_KEY = {
	LIST_ACTIVE: 'orders-waiter-active',
	LIST_HISTORY: 'orders-waiter-history',
	DETAIL_PREFIX: ORDER_DETAIL_KEY,
	DETAIL: (id: number) => [ORDER_DETAIL_KEY, id] as const,
	LIST_COOK_FREE: 'orders-cook-free',
	LIST_COOK_ACTIVE: 'orders-cook-active',
	LIST_COOK_HISTORY: 'orders-cook-history',
	ANALYTICS: (params: {
		groupBy?: string
		metric?: string
		from?: string
		to?: string
	}) =>
		[
			ORDER_ANALYTICS_KEY,
			params.groupBy,
			params.metric,
			params.from,
			params.to,
		] as const,
	ADMIN_LIST: (params: {
		page?: number
		limit?: number
		search?: string
		order?: string
		status?: string
		from?: string
		to?: string
		waiterId?: number
		cookId?: number
		tableId?: number
		sortBy?: string
	}) =>
		[
			ORDER_ADMIN_LIST_KEY,
			params.page,
			params.limit,
			params.search,
			params.order,
			params.status,
			params.from,
			params.to,
			params.waiterId,
			params.cookId,
			params.tableId,
			params.sortBy,
		] as const,
} as const
