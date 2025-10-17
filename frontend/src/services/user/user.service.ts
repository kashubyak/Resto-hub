import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type { IUser } from '@/types/user.interface'
import api from '@/utils/api'

export const getCurrentUser = async (
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<IUser>> => {
	const response = await api.get<IUser>(API_URL.USER.ME, config)
	return response
}
