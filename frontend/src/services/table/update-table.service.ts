import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { ITable, IUpdateTablePayload } from '@/types/table.interface'
import api from '@/utils/api'

export const updateTableService = async (
	id: number,
	payload: IUpdateTablePayload,
): Promise<ApiResponse<ITable>> => {
	const response = await api.patch<ITable>(API_URL.TABLE.ID(id), payload)
	return response
}
