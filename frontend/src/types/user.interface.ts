import type { UserRole } from '@/constants/pages.constant'

export interface IUser {
	id: string
	name: string
	email: string
	role: UserRole
	avatarUrl: string | null
	createdAt: string
	updatedAt: string
	companyId?: number
}
