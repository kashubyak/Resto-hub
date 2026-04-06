import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	ICreateOrderRequest,
	ICreateOrderResponse,
} from '@/types/order.interface'
import api from '@/utils/api'

export const createOrderService = async (
	body: ICreateOrderRequest,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<ICreateOrderResponse>> => {
	return api.post<ICreateOrderResponse>(API_URL.ORDER.CREATE, body, config)
}
