import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type { ITable } from '@/types/table.interface'
import api from '@/utils/api'

export const getTablesService = async (
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<ITable[]>> => {
	const response = await api.get<ITable[]>(API_URL.TABLE.ROOT, config)
	return response
}
