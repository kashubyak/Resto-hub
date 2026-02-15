import type { IUser } from './user.interface'

export interface ILoginRequest {
	subdomain: string
	email: string
	password: string
}

export interface ILoginResponse {
	success: boolean
	user?: {
		id: number
		role: string
	}
}

export interface IRegisterCompanyRequest {
	companyName: string
	ownerName: string
	email: string
	password: string
	phoneNumber: string
	subdomain: string
	lat: number
	lng: number
	address: string
	logo?: File
}

export interface IRegisterCompanyResponse {
	message: string
	company: ICompany
}

export interface IRefreshTokenResponse {
	success: boolean
	user?: {
		id: number
		role: string
	}
}

export interface ILogoutResponse {
	message: string
}

export interface ICompany {
	id: number
	name: string
	subdomain: string
	phoneNumber: string
	address: string
	lat: number
	lng: number
	logoUrl: string | null
	createdAt: string
	updatedAt: string
}

export interface IAuthContext {
	user: IUser | null
	isAuth: boolean
	login: (data: ILoginRequest) => Promise<void>
	logout: () => void
}
