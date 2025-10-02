import { API_URL } from '@/config/api'
import type { ApiResponse, IPaginationParams } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type { IDishListResponse } from '@/types/dish.interface'
import api from '@/utils/api'

export const getAllDishes = async (
	params?: IPaginationParams,
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<IDishListResponse>> => {
	const response = await api.get<IDishListResponse>(API_URL.DISH.ROOT, {
		params: {
			page: params?.page,
			limit: params?.limit,
		},
		...config,
	})
	return response
}
