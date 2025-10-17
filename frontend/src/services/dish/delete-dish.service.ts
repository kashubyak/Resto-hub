import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { IDeleteDishResponse } from '@/types/dish.interface'
import api from '@/utils/api'

export const deleteDish = async (
	id: number,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IDeleteDishResponse>> => {
	const response = await api.delete<IDeleteDishResponse>(API_URL.DISH.ID(id), config)
	return response
}
