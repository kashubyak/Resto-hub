import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	IGetWaiterMyOrdersParams,
	IWaiterOrdersListResponse,
} from '@/types/order.interface'
import api from '@/utils/api'

/** Shared waiter/cook history endpoint (legacy); prefer getWaiterMyOrdersService for waiter UI. */
export const getOrderHistoryService = async (
	params?: Omit<IGetWaiterMyOrdersParams, 'phase'>,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IWaiterOrdersListResponse>> => {
	const raw: Record<string, unknown> = {
		page: params?.page,
		limit: params?.limit,
		status: params?.status,
		sortBy: params?.sortBy,
		order: params?.order,
	}
	const cleanParams = Object.fromEntries(
		Object.entries(raw).filter(
			([, value]) => value !== undefined && value !== null && value !== '',
		),
	)

	return api.get<IWaiterOrdersListResponse>(API_URL.ORDER.HISTORY, {
		params: cleanParams,
		...config,
	})
}
