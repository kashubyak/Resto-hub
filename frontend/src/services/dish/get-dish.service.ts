import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type { IDish } from '@/types/dish.interface'
import api from '@/utils/api'

export const getDish = async (
	id: number,
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<IDish>> => {
	const response = await api.get<IDish>(API_URL.DISH.ID(id), config)
	return response
}
