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

export const ORDER_QUERY_KEY = {
	LIST_ACTIVE: 'orders-waiter-active',
	LIST_HISTORY: 'orders-waiter-history',
	DETAIL: (id: number) => ['order', id] as const,
} as const
