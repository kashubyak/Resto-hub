import BusinessIcon from '@mui/icons-material/Business'
import {
	Building2,
	Folder,
	LayoutDashboard,
	LayoutGrid,
	UtensilsCrossed,
} from 'lucide-react'
import type { ComponentType } from 'react'

export const SIDEBAR_SUBTITLE = 'Admin Panel'

export const DEFAULT_COMPANY_ICON = BusinessIcon

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
			DISH_CREATE: '/dish/create',
			DISH_ID: (id: number | string) => `${ROUTES.PRIVATE.ADMIN.DISH}/${id}`,
			CATEGORY: '/category',
			CATEGORY_ID: (id: number | string) =>
				`${ROUTES.PRIVATE.ADMIN.CATEGORY}/${id}`,
			TABLE: '/table',
			TABLE_ID: (id: number | string) => `${ROUTES.PRIVATE.ADMIN.TABLE}/${id}`,
			COMPANY: '/company',
			SETTINGS_COMPANY: '/settings/company',
		},
		COOK: {},
		WAITER: {},
	} as const,
} as const

export const PUBLIC_ROUTES_LIST: string[] = [
	ROUTES.PUBLIC.AUTH.LOGIN,
	ROUTES.PUBLIC.AUTH.REGISTER,
	ROUTES.PUBLIC.AUTH.REGISTER_SUCCESS,
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
		ROUTES.PRIVATE.ADMIN.DISH_CREATE,
		ROUTES.PRIVATE.ADMIN.CATEGORY,
		ROUTES.PRIVATE.ADMIN.TABLE,
		ROUTES.PRIVATE.ADMIN.COMPANY,
		ROUTES.PRIVATE.ADMIN.SETTINGS_COMPANY,
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
		icon: LayoutDashboard,
		roles: ADMIN_COOK_WAITER_ROLES,
	},
	{
		path: ROUTES.PRIVATE.ADMIN.DISH,
		name: 'Dishes',
		icon: UtensilsCrossed,
		roles: ADMIN_ROLES,
	},
	{
		path: ROUTES.PRIVATE.ADMIN.CATEGORY,
		name: 'Categories',
		icon: Folder,
		roles: ADMIN_ROLES,
	},
	{
		path: ROUTES.PRIVATE.ADMIN.TABLE,
		name: 'Tables',
		icon: LayoutGrid,
		roles: ADMIN_ROLES,
	},
	{
		path: ROUTES.PRIVATE.ADMIN.COMPANY,
		name: 'Company',
		icon: Building2,
		roles: ADMIN_ROLES,
	},
]
