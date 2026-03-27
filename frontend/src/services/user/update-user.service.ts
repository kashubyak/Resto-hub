import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { IUser } from '@/types/user.interface'
import { api } from '@/utils/api/axiosInstances'

export const updateUser = async (
	id: number,
	formData: FormData,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IUser>> => {
	const response = await api.patch<IUser>(API_URL.USER.ID(id), formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		...config,
	})
	return response
}
