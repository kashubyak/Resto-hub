import { API_URL } from '@/config/api'
import api from '@/utils/api'

export const deleteDish = (id: number) => {
	const response = api.delete(API_URL.DISH.ID(id))
	console.log(response)
	return response
}
