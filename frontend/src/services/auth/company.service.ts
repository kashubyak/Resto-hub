import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IRegisterCompanyResponse } from '@/types/auth.interface'
import api from '@/utils/api'

export const registerCompany = async (
	formData: FormData,
): Promise<ApiResponse<IRegisterCompanyResponse>> => {
	const response = await api.post<IRegisterCompanyResponse>(
		API_URL.AUTH.REGISTER,
		formData,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			withCredentials: true,
		},
	)
	return response
}
