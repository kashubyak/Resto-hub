import { API_URL } from '@/config/api'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import { api } from '@/utils/api/axiosInstances'

export const createDish = (formData: FormData, config?: CustomAxiosRequestConfig) => {
	const response = api.post(API_URL.DISH.CREATE, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		...config,
	})
	return response
}
