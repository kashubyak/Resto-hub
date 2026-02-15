import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IDish, IDishFormValues } from '@/types/dish.interface'
import api from '@/utils/api'

type UpdateDishPayload = Partial<IDishFormValues> & { id: number }

export const updateDishService = async (
	data: UpdateDishPayload,
): Promise<ApiResponse<IDish>> => {
	const { id, ...updateData } = data
	return api.patch<IDish>(API_URL.DISH.ID(id), updateData)
}
