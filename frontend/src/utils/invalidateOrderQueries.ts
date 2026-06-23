import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import {
	isOrderDetailQueryKey,
	normalizeOrderId,
} from '@/utils/patchOrderStatusInCache'
import type { QueryClient } from '@tanstack/react-query'

export function invalidateOrderQueries(
	queryClient: QueryClient,
	orderId?: number | string,
) {
	if (orderId != null) {
		const id = normalizeOrderId(orderId)
		void queryClient.invalidateQueries({
			predicate: (q) => isOrderDetailQueryKey(q.queryKey, id),
		})
	}

	void queryClient.invalidateQueries({
		queryKey: [ORDER_QUERY_KEY.LIST_ACTIVE],
	})
	void queryClient.invalidateQueries({
		queryKey: [ORDER_QUERY_KEY.LIST_HISTORY],
	})
	void queryClient.invalidateQueries({
		queryKey: [ORDER_QUERY_KEY.LIST_COOK_FREE],
	})
	void queryClient.invalidateQueries({
		queryKey: [ORDER_QUERY_KEY.LIST_COOK_ACTIVE],
	})
	void queryClient.invalidateQueries({
		queryKey: [ORDER_QUERY_KEY.LIST_COOK_HISTORY],
	})
}
