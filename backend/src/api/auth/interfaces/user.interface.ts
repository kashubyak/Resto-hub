import { Role } from '@prisma/client'

export interface IJwtUser {
	id: number
	role: Role
	companyId: number
}

export interface IAuthenticatedUser extends IJwtUser {
	name?: string
	email?: string
	avatarUrl?: string
}
