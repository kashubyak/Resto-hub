import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { ITable } from '@/types/table.interface'
import api from '@/utils/api'

export const deleteTableService = async (
	id: number,
): Promise<ApiResponse<ITable>> => {
	const response = await api.delete<ITable>(API_URL.TABLE.ID(id))
	return response
}
