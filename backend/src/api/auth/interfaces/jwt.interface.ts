import { Role } from '@prisma/client'

export interface IJwtPayload {
	sub: number
	role: Role
	iat?: number
	exp?: number
}

export interface IJwtConfig {
	secret: string
	refreshSecret: string
	expiresIn: string
	refreshExpiresIn: string
}

export interface ITokenPair {
	accessToken: string
	refreshToken: string
}

export interface ITokenResponse {
	token: string
}
