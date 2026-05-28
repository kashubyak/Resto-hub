import { ORDER_QUERY_KEY } from '@/constants/query-keys.constant'
import type { QueryClient } from '@tanstack/react-query'

export function invalidateOrderQueries(
	queryClient: QueryClient,
	orderId?: number,
) {
	if (orderId != null)
		void queryClient.invalidateQueries({
			queryKey: ORDER_QUERY_KEY.DETAIL(orderId),
		})

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
