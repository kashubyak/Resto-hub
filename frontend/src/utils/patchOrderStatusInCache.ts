import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import type { ApiResponse } from '@/types/api.interface'
import type {
	IOrderSummary,
	IWaiterOrdersListResponse,
	OrderStatus,
} from '@/types/order.interface'
import { invalidateOrderQueries } from '@/utils/invalidateOrderQueries'
import type { QueryClient, QueryKey } from '@tanstack/react-query'

const ORDER_STATUSES: OrderStatus[] = [
	'PENDING',
	'IN_PROGRESS',
	'COMPLETE',
	'CANCELED',
	'DELIVERED',
	'FINISHED',
]

const ORDER_LIST_PREFIXES = [
	ORDER_QUERY_KEY.LIST_ACTIVE,
	ORDER_QUERY_KEY.LIST_HISTORY,
	ORDER_QUERY_KEY.LIST_COOK_FREE,
	ORDER_QUERY_KEY.LIST_COOK_ACTIVE,
	ORDER_QUERY_KEY.LIST_COOK_HISTORY,
] as const

type OrderListCache = ApiResponse<IWaiterOrdersListResponse>

export interface IOrderCacheSnapshot {
	previousDetail?: ApiResponse<IOrderSummary>
	previousLists: Array<[QueryKey, unknown]>
}

export function isOrderStatus(value: string): value is OrderStatus {
	return ORDER_STATUSES.includes(value as OrderStatus)
}

function patchOrderInListCaches(
	queryClient: QueryClient,
	orderId: number,
	status: OrderStatus,
): void {
	for (const prefix of ORDER_LIST_PREFIXES) {
		queryClient.setQueriesData<OrderListCache>(
			{ queryKey: [prefix] },
			(old) => {
				if (!old?.data?.data) return old
				const items = old.data.data
				const hasOrder = items.some((o) => o.id === orderId)
				if (!hasOrder) return old
				const next = items.map((o) => (o.id === orderId ? { ...o, status } : o))
				return { ...old, data: { ...old.data, data: next } }
			},
		)
	}
}

export function patchOrderStatusInCache(
	queryClient: QueryClient,
	orderId: number,
	status: OrderStatus,
): void {
	queryClient.setQueryData<ApiResponse<IOrderSummary>>(
		ORDER_QUERY_KEY.DETAIL(orderId),
		(old) => (old?.data ? { ...old, data: { ...old.data, status } } : old),
	)

	patchOrderInListCaches(queryClient, orderId, status)
}

export function removeOrderFromListCache(
	queryClient: QueryClient,
	orderId: number,
	listPrefix: string,
): void {
	queryClient.setQueriesData<OrderListCache>(
		{ queryKey: [listPrefix] },
		(old) => {
			if (!old?.data?.data) return old
			const next = old.data.data.filter((o) => o.id !== orderId)
			if (next.length === old.data.data.length) return old
			return { ...old, data: { ...old.data, data: next } }
		},
	)
}

export function syncOrderFromServer(
	queryClient: QueryClient,
	orderId: number,
): void {
	invalidateOrderQueries(queryClient, orderId)
}

export function snapshotOrderCaches(
	queryClient: QueryClient,
	orderId: number,
): IOrderCacheSnapshot {
	const previousDetail = queryClient.getQueryData<ApiResponse<IOrderSummary>>(
		ORDER_QUERY_KEY.DETAIL(orderId),
	)

	const previousLists: Array<[QueryKey, unknown]> = []
	for (const prefix of ORDER_LIST_PREFIXES) {
		const entries = queryClient.getQueriesData({ queryKey: [prefix] })
		previousLists.push(...entries)
	}

	return { previousDetail, previousLists }
}

export function restoreOrderCaches(
	queryClient: QueryClient,
	snapshot: IOrderCacheSnapshot,
	orderId: number,
): void {
	if (snapshot.previousDetail !== undefined)
		queryClient.setQueryData(
			ORDER_QUERY_KEY.DETAIL(orderId),
			snapshot.previousDetail,
		)

	for (const [key, data] of snapshot.previousLists)
		queryClient.setQueryData(key, data)
}
