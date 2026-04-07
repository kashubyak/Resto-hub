import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	IGetCookMyOrdersParams,
	IWaiterOrdersListResponse,
} from '@/types/order.interface'
import api from '@/utils/api'

export const getCookMyOrdersService = async (
	params?: IGetCookMyOrdersParams,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IWaiterOrdersListResponse>> => {
	const raw: Record<string, unknown> = {
		phase: params?.phase,
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

	return api.get<IWaiterOrdersListResponse>(API_URL.ORDER.COOK_MY_ORDERS, {
		params: cleanParams,
		...config,
	})
}
