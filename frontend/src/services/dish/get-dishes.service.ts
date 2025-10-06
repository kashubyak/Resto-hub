import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type { IDishListResponse, IGetAllDishesParams } from '@/types/dish.interface'
import api from '@/utils/api'

export const getAllDishes = async (
	params?: IGetAllDishesParams,
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<IDishListResponse>> => {
	let sortBy = params?.sortBy
	let order = params?.order

	if (sortBy && typeof sortBy === 'string' && sortBy.includes('-')) {
		const [field, direction] = sortBy.split('-')
		sortBy = field
		order = direction as 'asc' | 'desc'
	}

	const cleanParams = Object.fromEntries(
		Object.entries({
			page: params?.page,
			limit: params?.limit,
			search: params?.search,
			minPrice: params?.minPrice,
			maxPrice: params?.maxPrice,
			available: params?.available,
			sortBy,
			order,
		}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
	)

	const response = await api.get<IDishListResponse>(API_URL.DISH.ROOT, {
		params: cleanParams,
		...config,
	})

	return response
}
