import { API_URL } from '@/config/api'
import type { ApiResponse } from '@/types/api.interface'
import type { IServerSideRequestConfig } from '@/types/axios.interface'
import type { IGetUsersParams, IUserListResponse } from '@/types/user.interface'
import api from '@/utils/api'

export const getUsers = async (
	params?: IGetUsersParams,
	config?: IServerSideRequestConfig,
): Promise<ApiResponse<IUserListResponse>> => {
	let sortBy = params?.sortBy
	let order = params?.order

	if (sortBy && typeof sortBy === 'string' && sortBy.includes('-')) {
		const [field, direction] = sortBy.split('-')
		sortBy = field as IGetUsersParams['sortBy']
		order = direction as 'asc' | 'desc'
	}

	const cleanParams = Object.fromEntries(
		Object.entries({
			page: params?.page,
			limit: params?.limit,
			search: params?.search,
			role: params?.role,
			sortBy,
			order,
		}).filter(
			([, value]) => value !== undefined && value !== null && value !== '',
		),
	)

	const response = await api.get<IUserListResponse>(API_URL.USER.ROOT, {
		params: cleanParams,
		...config,
	})

	return response
}
