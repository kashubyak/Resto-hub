import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { IOrderMutationResponse } from '@/types/order.interface'
import api from '@/utils/api'

export const assignOrderService = async (
	orderId: number,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IOrderMutationResponse>> => {
	return api.patch<IOrderMutationResponse>(
		API_URL.ORDER.ASSIGN(orderId),
		{},
		config,
	)
}
