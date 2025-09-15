import { API_URL } from '@/config/api'
import api from '@/utils/api'

export const createDish = (formData: FormData) => {
	const response = api.post(API_URL.DISH.CREATE, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})
	return response
}
