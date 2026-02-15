import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type {
	ICategoryListResponse,
	IGetAllCategoriesParams,
} from '@/types/category.interface'
import api from '@/utils/api'

export const getCategoriesService = async (
	params?: IGetAllCategoriesParams,
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<ICategoryListResponse>> => {
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
			hasDishes: params?.hasDishes,
			sortBy,
			order,
		}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
	)

	const response = await api.get(API_URL.CATEGORY.ROOT, {
		params: cleanParams,
		...config,
	})
	return response
}
