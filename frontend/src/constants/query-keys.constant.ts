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

export const ORDER_QUERY_KEY = {
	LIST_ACTIVE: 'orders-waiter-active',
	LIST_HISTORY: 'orders-waiter-history',
	DETAIL_PREFIX: ORDER_DETAIL_KEY,
	DETAIL: (id: number) => [ORDER_DETAIL_KEY, id] as const,
	LIST_COOK_FREE: 'orders-cook-free',
	LIST_COOK_ACTIVE: 'orders-cook-active',
	LIST_COOK_HISTORY: 'orders-cook-history',
} as const
