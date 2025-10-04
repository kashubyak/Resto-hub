import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type { IDishListResponse, IGetAllDishesParams } from '@/types/dish.interface'
import api from '@/utils/api'

export const getAllDishes = async (
	params?: IGetAllDishesParams,
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<IDishListResponse>> => {
	const response = await api.get<IDishListResponse>(API_URL.DISH.ROOT, {
		params: {
			page: params?.page,
			limit: params?.limit,
			search: params?.search,
			minPrice: params?.minPrice,
			maxPrice: params?.maxPrice,
			available: params?.available,
			sortBy: params?.sortBy,
			order: params?.order,
		},
		...config,
	})
	console.log(response)

	return response
}
