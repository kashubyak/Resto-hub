import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { IUser } from '@/types/user.interface'
import { api } from '@/utils/api/axiosInstances'

export const registerUser = async (
	formData: FormData,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<IUser>> => {
	const response = await api.post<IUser>(API_URL.USER.REGISTER, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		...config,
	})
	return response
}
