export interface IRefreshTokenCookieOptions {
	httpOnly: boolean
	secure: boolean
	sameSite: 'strict' | 'lax' | 'none'
	domain?: string
	path: string
	maxAge: number
}


export interface IEnvironmentConfig {
	nodeEnv: string
	domain?: string
}
