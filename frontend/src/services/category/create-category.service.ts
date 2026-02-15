import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	ICategoryFormValues,
	ICreateCategoryResponse,
} from '@/types/category.interface'
import { api } from '@/utils/api/axiosInstances'

export const createCategory = async (
	data: ICategoryFormValues,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<ICreateCategoryResponse>> => {
	const response = await api.post<ICreateCategoryResponse>(
		API_URL.CATEGORY.CREATE,
		data,
		config,
	)
	return response
}
