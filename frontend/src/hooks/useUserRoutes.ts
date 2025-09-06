import { ROLE_ROUTES_MAP, ROUTES, UserRole } from '@/constants/pages.constant'
import { useAuthStore } from '@/store/auth.store'
import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupIcon from '@mui/icons-material/Group'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import PersonIcon from '@mui/icons-material/Person'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import SettingsIcon from '@mui/icons-material/Settings'
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant'
import { useMemo, type ComponentType } from 'react'

interface IRouteConfig {
	path: string
	name: string
	icon: ComponentType
	roles: UserRole[]
}
const ALL_ROUTES: IRouteConfig[] = [
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
export const useUserRoutes = () => {
	const { userRole } = useAuthStore()

	const userRoutes = useMemo(() => {
		if (!userRole) return []
		const allowedPaths = ROLE_ROUTES_MAP[userRole] || []
		return ALL_ROUTES.filter(route => allowedPaths.includes(route.path))
	}, [userRole])

	const hasAccess = useMemo(() => {
		return (path: string): boolean => {
			if (!userRole) return false
			return ROLE_ROUTES_MAP[userRole]?.includes(path) || false
		}
	}, [userRole])

	return {
		routes: userRoutes,
		hasAccess,
	}
}
