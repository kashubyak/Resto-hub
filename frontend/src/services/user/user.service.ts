import { API_URL } from '@/config/api'
import api from '@/utils/api'

export const getCurrentUser = () => {
	const response = api.get(API_URL.USER.ME)
	return response
}
