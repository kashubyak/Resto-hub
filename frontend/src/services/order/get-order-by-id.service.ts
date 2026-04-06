import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { IOrderSummary } from '@/types/order.interface'
import api from '@/utils/api'

export const getOrderByIdService = async (
	id: number,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IOrderSummary>> => {
	return api.get<IOrderSummary>(API_URL.ORDER.ID(id), config)
}
