import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { ICreateDishRequest } from '@/types/dish.interface'
import api from '@/utils/api'

export const deleteDishFromCategory = async (
	id: number,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<ICreateDishRequest>> => {
	const response = await api.patch<ICreateDishRequest>(
		API_URL.DISH.REMOVE_CATEGORY(id),
		config,
	)
	console.log(response)

	return response
}
