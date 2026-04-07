import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	IGetFreeOrdersParams,
	IWaiterOrdersListResponse,
} from '@/types/order.interface'
import api from '@/utils/api'

export const getFreeOrdersService = async (
	params?: IGetFreeOrdersParams,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IWaiterOrdersListResponse>> => {
	const raw: Record<string, unknown> = {
		page: params?.page,
		limit: params?.limit,
		status: params?.status,
		sortBy: params?.sortBy,
		order: params?.order,
		from: params?.from,
		to: params?.to,
		waiterId: params?.waiterId,
		cookId: params?.cookId,
		tableId: params?.tableId,
		search: params?.search,
	}
	const cleanParams = Object.fromEntries(
		Object.entries(raw).filter(
			([, value]) => value !== undefined && value !== null && value !== '',
		),
	)

	return api.get<IWaiterOrdersListResponse>(API_URL.ORDER.FREE, {
		params: cleanParams,
		...config,
	})
}
