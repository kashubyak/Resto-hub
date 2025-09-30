import { API_URL } from '@/config/api'
import type { IDishResponse } from '@/types/dish.interface'
import api from '@/utils/api'

export const getAllDishes = async (page?: number, limit?: number) => {
	const response = await api.get<IDishResponse>(API_URL.DISH.ROOT, {
		params: { page, limit },
	})
	return response.data
}
