import type { UserRole } from '@/constants/pages.constant'

export interface ILogin {
	subdomain: string
	email: string
	password: string
}
export interface IUser {
	id: string
	name: string
	email: string
	role: UserRole
	avatarUrl: string
	createdAt: string
	updatedAt: string
}
export interface IAuthContext {
	user: IUser | null
	isAuth: boolean
	login: (data: ILogin) => Promise<void>
	logout: () => void
}
