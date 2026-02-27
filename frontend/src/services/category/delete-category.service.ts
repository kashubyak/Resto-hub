import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { ICategory } from '@/types/category.interface'
import api from '@/utils/api'

export const deleteCategoryService = async (
	id: number,
): Promise<ApiResponse<ICategory>> => {
	const response = await api.delete<ICategory>(API_URL.CATEGORY.ID(id))
	return response
}
