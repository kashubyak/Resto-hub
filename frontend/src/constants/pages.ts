export const ROUTES = {
	PUBLIC: {
		AUTH: {
			ROOT: '/auth',
			LOGIN: '/auth/login',
			REGISTER: '/auth/register',
		} as const,
		STATIC: {
			ROOT: '/_next',
			FAVICON: '/favicon.ico',
		},
		API_PUBLIC: '/api/public',
	} as const,

	PRIVATE: {
		DASHBOARD: '/',
	} as const,
} as const

export const PUBLIC_ROUTES_LIST: string[] = [
	ROUTES.PUBLIC.AUTH.LOGIN,
	ROUTES.PUBLIC.AUTH.REGISTER,
	ROUTES.PUBLIC.STATIC.ROOT,
	ROUTES.PUBLIC.API_PUBLIC,
	ROUTES.PUBLIC.STATIC.FAVICON,
]

export const AUTH_ROUTES_LIST: string[] = [
	ROUTES.PUBLIC.AUTH.LOGIN,
	ROUTES.PUBLIC.AUTH.REGISTER,
]
