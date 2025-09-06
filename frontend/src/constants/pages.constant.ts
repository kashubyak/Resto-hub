import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import PersonIcon from '@mui/icons-material/Person'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SettingsIcon from '@mui/icons-material/Settings'
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant'
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
			PROFILE: '/profile',
		},
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

const SHARED_ROUTES = [ROUTES.PRIVATE.SHARED.DASHBOARD, ROUTES.PRIVATE.SHARED.PROFILE]

export const ROLE_ROUTES_MAP: Record<UserRole, string[]> = {
	[UserRole.ADMIN]: [
		...SHARED_ROUTES,
		ROUTES.PRIVATE.ADMIN.ROOT,
		ROUTES.PRIVATE.ADMIN.STAFF,
		ROUTES.PRIVATE.ADMIN.SETTINGS,
	],
	[UserRole.COOK]: [
		...SHARED_ROUTES,
		ROUTES.PRIVATE.COOK.ROOT,
		ROUTES.PRIVATE.COOK.ORDERS,
	],
	[UserRole.WAITER]: [
		...SHARED_ROUTES,
		ROUTES.PRIVATE.WAITER.ROOT,
		ROUTES.PRIVATE.WAITER.ORDERS,
		ROUTES.PRIVATE.WAITER.TABLES,
	],
}

export const ALL_ROUTES: IRouteConfig[] = [
	{
		path: ROUTES.PRIVATE.SHARED.DASHBOARD,
		name: 'Dashboard',
		icon: DashboardIcon,
		roles: [UserRole.ADMIN, UserRole.COOK, UserRole.WAITER],
	},
	{
		path: ROUTES.PRIVATE.SHARED.PROFILE,
		name: 'Profile',
		icon: PersonIcon,
		roles: [UserRole.ADMIN, UserRole.COOK, UserRole.WAITER],
	},
	{
		path: ROUTES.PRIVATE.ADMIN.ROOT,
		name: 'Admin Panel',
		icon: AudiotrackIcon,
		roles: [UserRole.ADMIN],
	},
	{
		path: ROUTES.PRIVATE.ADMIN.STAFF,
		name: 'Staff',
		icon: GroupIcon,
		roles: [UserRole.ADMIN],
	},
	{
		path: ROUTES.PRIVATE.ADMIN.SETTINGS,
		name: 'Settings',
		icon: SettingsIcon,
		roles: [UserRole.ADMIN],
	},
	{
		path: ROUTES.PRIVATE.COOK.ROOT,
		name: 'Kitchen',
		icon: RestaurantIcon,
		roles: [UserRole.COOK],
	},
	{
		path: ROUTES.PRIVATE.COOK.ORDERS,
		name: 'Free Orders',
		icon: LocalDiningIcon,
		roles: [UserRole.COOK],
	},
	{
		path: ROUTES.PRIVATE.WAITER.ROOT,
		name: 'Waiter Panel',
		icon: LocalDiningIcon,
		roles: [UserRole.WAITER],
	},
	{
		path: ROUTES.PRIVATE.WAITER.ORDERS,
		name: 'Orders',
		icon: LocalDiningIcon,
		roles: [UserRole.WAITER],
	},
	{
		path: ROUTES.PRIVATE.WAITER.TABLES,
		name: 'Tables',
		icon: TableRestaurantIcon,
		roles: [UserRole.WAITER],
	},
]
