import { API_URL } from '@/config/api'
import api from '@/utils/api'

export const registerCompany = async (formData: FormData) => {
	const response = await api.post(API_URL.AUTH.REGISTER, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		withCredentials: true,
	})
	return response
}
