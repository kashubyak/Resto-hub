import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import type { ApiResponse } from '@/types/api.interface'
import type {
	IOrderSummary,
	IWaiterOrdersListResponse,
	OrderStatus,
} from '@/types/order.interface'
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
	previousDetails: Array<[QueryKey, unknown]>
	previousLists: Array<[QueryKey, unknown]>
}

export function normalizeOrderId(id: number | string): number {
	return Number(id)
}

export function isOrderDetailQueryKey(
	queryKey: QueryKey,
	orderId: number | string,
): boolean {
	const id = normalizeOrderId(orderId)
	return (
		queryKey[0] === ORDER_QUERY_KEY.DETAIL_PREFIX &&
		Number(queryKey[1]) === id
	)
}

export function isOrderStatus(value: string): value is OrderStatus {
	return ORDER_STATUSES.includes(value as OrderStatus)
}

function isOrderSummary(value: unknown): value is IOrderSummary {
	if (typeof value !== 'object' || value === null) return false
	const o = value as Record<string, unknown>
	return (
		typeof o.id === 'number' &&
		typeof o.status === 'string' &&
		Array.isArray(o.orderItems)
	)
}

export function patchDetailCacheShape(
	old: unknown,
	status: OrderStatus,
): unknown {
	if (old == null) return old

	if (typeof old !== 'object') return old

	const record = old as Record<string, unknown>

	if (isOrderSummary(record.data))
		return {
			...record,
			data: { ...(record.data as IOrderSummary), status },
		}

	if (isOrderSummary(old)) return { ...old, status }

	if (typeof record.data === 'object' && record.data !== null) {
		const inner = record.data as Record<string, unknown>
		if (isOrderSummary(inner.data)) {
			return {
				...record,
				data: {
					...inner,
					data: { ...(inner.data as IOrderSummary), status },
				},
			}
		}
	}

	return old
}

function findOrderInListCaches(
	queryClient: QueryClient,
	orderId: number,
): IOrderSummary | undefined {
	for (const prefix of ORDER_LIST_PREFIXES) {
		const entries = queryClient.getQueriesData<OrderListCache>({
			queryKey: [prefix],
		})
		for (const [, cache] of entries) {
			const order = cache?.data?.data?.find((o) => o.id === orderId)
			if (order) return order
		}
	}
	return undefined
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

function patchDetailOrderInCache(
	queryClient: QueryClient,
	orderId: number,
	status: OrderStatus,
): void {
	queryClient.setQueriesData<unknown>(
		{ predicate: (q) => isOrderDetailQueryKey(q.queryKey, orderId) },
		(old: unknown) => patchDetailCacheShape(old, status),
	)

	const hasDetail = queryClient
		.getQueriesData({
			predicate: (q) => isOrderDetailQueryKey(q.queryKey, orderId),
		})
		.some(([, data]) => data != null)

	if (!hasDetail) {
		const fromList = findOrderInListCaches(queryClient, orderId)
		if (fromList) {
			queryClient.setQueryData(
				ORDER_QUERY_KEY.DETAIL(orderId),
				{ data: { ...fromList, status } } as ApiResponse<IOrderSummary>,
			)
		}
	}
}

export function patchOrderStatusInCache(
	queryClient: QueryClient,
	orderId: number | string,
	status: OrderStatus,
): void {
	const id = normalizeOrderId(orderId)
	patchOrderInListCaches(queryClient, id, status)
	patchDetailOrderInCache(queryClient, id, status)
}

export function removeOrderFromListCache(
	queryClient: QueryClient,
	orderId: number | string,
	listPrefix: string,
): void {
	const id = normalizeOrderId(orderId)
	queryClient.setQueriesData<OrderListCache>(
		{ queryKey: [listPrefix] },
		(old) => {
			if (!old?.data?.data) return old
			const next = old.data.data.filter((o) => o.id !== id)
			if (next.length === old.data.data.length) return old
			return { ...old, data: { ...old.data, data: next } }
		},
	)
}

export function snapshotOrderCaches(
	queryClient: QueryClient,
	orderId: number | string,
): IOrderCacheSnapshot {
	const id = normalizeOrderId(orderId)

	const previousDetails = queryClient.getQueriesData({
		predicate: (q) => isOrderDetailQueryKey(q.queryKey, id),
	})

	const previousLists: Array<[QueryKey, unknown]> = []
	for (const prefix of ORDER_LIST_PREFIXES) {
		const entries = queryClient.getQueriesData({ queryKey: [prefix] })
		previousLists.push(...entries)
	}

	return { previousDetails, previousLists }
}

export function restoreOrderCaches(
	queryClient: QueryClient,
	snapshot: IOrderCacheSnapshot,
	_orderId: number | string,
): void {
	for (const [key, data] of snapshot.previousDetails)
		queryClient.setQueryData(key, data)

	for (const [key, data] of snapshot.previousLists)
		queryClient.setQueryData(key, data)
}
