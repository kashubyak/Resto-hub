import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type {
	ICreateTablePayload,
	ICreateTableResponse,
} from '@/types/table.interface'
import { api } from '@/utils/api/axiosInstances'

export const createTableService = async (
	data: ICreateTablePayload,
	config?: CustomAxiosRequestConfig,
): Promise<ApiResponse<ICreateTableResponse>> => {
	const response = await api.post<ICreateTableResponse>(
		API_URL.TABLE.CREATE,
		data,
		config,
	)
	return response
}
