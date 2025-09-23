import DashboardIcon from '@mui/icons-material/Dashboard'
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu'
import type { ComponentType } from 'react'

export enum UserRole {
	ADMIN = 'ADMIN',
	COOK = 'COOK',
	WAITER = 'WAITER',
}

interface IRouteConfig {
	path: string
	name: string
	icon: ComponentType
	roles: UserRole[]
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
		SHARED: {
			DASHBOARD: '/',
		},
		ADMIN: {
			DISH: '/dish',
			DISH_ID: (id: number | string) => `/dish/${id}`,
		},
		COOK: {},
		WAITER: {},
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

const SHARED_ROUTES = [ROUTES.PRIVATE.SHARED.DASHBOARD]

export const ROLE_ROUTES_MAP: Record<UserRole, string[]> = {
	[UserRole.ADMIN]: [...SHARED_ROUTES, ROUTES.PRIVATE.ADMIN.DISH],
	[UserRole.COOK]: [...SHARED_ROUTES],
	[UserRole.WAITER]: [...SHARED_ROUTES],
}

export const ALL_ROUTES: IRouteConfig[] = [
	{
		path: ROUTES.PRIVATE.SHARED.DASHBOARD,
		name: 'Dashboard',
		icon: DashboardIcon,
		roles: [UserRole.ADMIN, UserRole.COOK, UserRole.WAITER],
	},
	{
		path: ROUTES.PRIVATE.ADMIN.DISH,
		name: 'Dishes',
		icon: RestaurantMenuIcon,
		roles: [UserRole.ADMIN],
	},
]
