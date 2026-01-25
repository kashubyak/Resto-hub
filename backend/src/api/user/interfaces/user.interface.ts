import { type Role } from '@prisma/client'
import {
	type IBaseUser,
	type IExtendedUser,
} from 'src/common/interface/user.interface'

export interface IUserRecord {
	id: number
	name: string
	email: string
	role: Role
	avatarUrl: string
	createdAt: Date
	updatedAt: Date
}

export interface IUserWithCompanyId extends IUserRecord {
	companyId: number
}

export interface IUserWithPassword {
	id: number
	name: string
	email: string
	password: string
	role: Role
	avatarUrl: string
}

export type { IBaseUser, IExtendedUser }
