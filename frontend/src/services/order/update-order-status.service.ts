import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	IOrderMutationResponse,
	IUpdateOrderStatusRequest,
} from '@/types/order.interface'
import api from '@/utils/api'

export const updateOrderStatusService = async (
	orderId: number,
	body: IUpdateOrderStatusRequest,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IOrderMutationResponse>> => {
	return api.patch<IOrderMutationResponse>(
		API_URL.ORDER.STATUS(orderId),
		body,
		config,
	)
}
