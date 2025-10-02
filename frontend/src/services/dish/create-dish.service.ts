import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { ICreateDishResponse } from '@/types/dish.interface'
import { api } from '@/utils/api/axiosInstances'

export const createDish = async (
	formData: FormData,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<ICreateDishResponse>> => {
	const response = await api.post<ICreateDishResponse>(API_URL.DISH.CREATE, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		...config,
	})
	return response
}
