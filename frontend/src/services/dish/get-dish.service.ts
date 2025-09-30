import { API_URL } from '@/config/api'
import type { IDish } from '@/types/dish.interface'
import api from '@/utils/api'

export const getDish = async (id: number): Promise<IDish> => {
	const response = await api.get<IDish>(API_URL.DISH.ID(id))
	return response.data
}
