import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type { IUser } from '@/types/user.interface'
import api from '@/utils/api'

export const deleteUser = async (
	id: number,
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<IUser>> => {
	const response = await api.delete<IUser>(API_URL.USER.ID(id), config)
	return response
}
