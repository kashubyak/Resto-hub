import CategoryIcon from '@mui/icons-material/Category'
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
			REGISTER_SUCCESS: '/auth/register-success',
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
			DISH_ID: (id: number | string) => `${ROUTES.PRIVATE.ADMIN.DISH}/${id}`,
			CATEGORY: '/category',
			CATEGORY_ID: (id: number | string) => `${ROUTES.PRIVATE.ADMIN.CATEGORY}/${id}`,
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

const SHARED_ROUTES: string[] = [ROUTES.PRIVATE.SHARED.DASHBOARD]

export const ROLE_ROUTES_MAP: Record<UserRole, string[]> = {
	[UserRole.ADMIN]: [
		...SHARED_ROUTES,
		ROUTES.PRIVATE.ADMIN.DISH,
		ROUTES.PRIVATE.ADMIN.CATEGORY,
	],
	[UserRole.COOK]: [...SHARED_ROUTES],
	[UserRole.WAITER]: [...SHARED_ROUTES],
}

const ADMIN_COOK_WAITER_ROLES: UserRole[] = [
	UserRole.ADMIN,
	UserRole.COOK,
	UserRole.WAITER,
]

const ADMIN_ROLES: UserRole[] = [UserRole.ADMIN]

export const ALL_ROUTES: IRouteConfig[] = [
	{
		path: ROUTES.PRIVATE.SHARED.DASHBOARD,
		name: 'Dashboard',
		icon: DashboardIcon,
		roles: ADMIN_COOK_WAITER_ROLES,
	},
	{
		path: ROUTES.PRIVATE.ADMIN.DISH,
		name: 'Dishes',
		icon: RestaurantMenuIcon,
		roles: ADMIN_ROLES,
	},
	{
		path: ROUTES.PRIVATE.ADMIN.CATEGORY,
		name: 'Categories',
		icon: CategoryIcon,
		roles: ADMIN_ROLES,
	},
]
