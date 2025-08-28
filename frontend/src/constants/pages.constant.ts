export enum UserRole {
	ADMIN = 'ADMIN',
	COOK = 'COOK',
	WAITER = 'WAITER',
}

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
			MANIFEST: '/site.webmanifest',
			ICONS: {
				ANDROID_192: '/android-chrome-192x192.png',
				ANDROID_512: '/android-chrome-512x512.png',
				APPLE_TOUCH: '/apple-touch-icon.png',
			},
		},
		API_PUBLIC: '/api/public',
		NOT_FOUND: '/404',
	} as const,

	PRIVATE: {
		DASHBOARD: '/',
		ADMIN: {
			ROOT: '/admin',
			STAFF: '/admin/staff',
			SETTINGS: '/admin/settings',
		},
		COOK: {
			ROOT: '/cook',
			ORDERS: '/cook/free-orders',
		},
		WAITER: {
			ROOT: '/waiter',
			ORDERS: '/waiter/orders',
			TABLES: '/waiter/tables',
		},
	} as const,
} as const

export const PUBLIC_ROUTES_LIST: string[] = [
	ROUTES.PUBLIC.AUTH.LOGIN,
	ROUTES.PUBLIC.AUTH.REGISTER,
	ROUTES.PUBLIC.STATIC.ROOT,
	ROUTES.PUBLIC.API_PUBLIC,
	ROUTES.PUBLIC.STATIC.FAVICON,
	ROUTES.PUBLIC.STATIC.MANIFEST,
	ROUTES.PUBLIC.STATIC.ICONS.ANDROID_192,
	ROUTES.PUBLIC.STATIC.ICONS.ANDROID_512,
	ROUTES.PUBLIC.STATIC.ICONS.APPLE_TOUCH,
]

export const AUTH_ROUTES_LIST: string[] = [
	ROUTES.PUBLIC.AUTH.LOGIN,
	ROUTES.PUBLIC.AUTH.REGISTER,
]
