import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { IDish } from '@/types/dish.interface'
import api from '@/utils/api'

export const deleteDishFromCategory = async (
	id: number,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IDish>> => {
	const response = await api.patch<IDish>(API_URL.DISH.REMOVE_CATEGORY(id), {}, config)
	return response
}
