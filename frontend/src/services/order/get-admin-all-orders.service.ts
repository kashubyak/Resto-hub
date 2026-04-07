import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	IGetAdminAllOrdersParams,
	IWaiterOrdersListResponse,
} from '@/types/order.interface'
import api from '@/utils/api'

export const getAdminAllOrdersService = async (
	params?: IGetAdminAllOrdersParams,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IWaiterOrdersListResponse>> => {
	const raw: Record<string, unknown> = {
		page: params?.page,
		limit: params?.limit,
		search: params?.search,
		order: params?.order,
		status: params?.status,
		from: params?.from,
		to: params?.to,
		waiterId: params?.waiterId,
		cookId: params?.cookId,
		tableId: params?.tableId,
		sortBy: params?.sortBy,
	}
	const cleanParams = Object.fromEntries(
		Object.entries(raw).filter(
			([, value]) => value !== undefined && value !== null && value !== '',
		),
	)

	return api.get<IWaiterOrdersListResponse>(API_URL.ORDER.LIST, {
		params: cleanParams,
		...config,
	})
}
