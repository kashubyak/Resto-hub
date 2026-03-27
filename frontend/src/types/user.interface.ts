import type { UserRole } from '@/constants/pages.constant'
import type { IPaginatedResponse } from '@/types/api.interface'

export interface IUser {
	id: number
	name: string
	email: string
	role: UserRole
	avatarUrl: string | null
	createdAt: string
	updatedAt: string
	companyId?: number
}

export type UserListRoleFilter = Extract<UserRole, 'COOK' | 'WAITER'>

export interface IGetUsersParams {
	page?: number
	limit?: number
	search?: string
	role?: UserListRoleFilter
	sortBy?: 'name' | 'email' | 'createdAt' | 'updatedAt'
	order?: 'asc' | 'desc'
}

export type IUserListResponse = IPaginatedResponse<IUser>
