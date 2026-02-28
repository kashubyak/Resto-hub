import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { ICategory } from '@/types/category.interface'
import api from '@/utils/api'

export interface IUpdateCategoryPayload {
	name?: string
	icon?: string
}

export const updateCategoryService = async (
	id: number,
	payload: IUpdateCategoryPayload,
): Promise<ApiResponse<ICategory>> => {
	const response = await api.patch<ICategory>(API_URL.CATEGORY.ID(id), payload)
	return response
}
