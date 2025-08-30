import { ROLE_ROUTES_MAP, type UserRole } from '@/constants/pages.constant'

export const hasRoleAccess = (userRole: UserRole, pathname: string) => {
	const allowedRoutes = ROLE_ROUTES_MAP[userRole]

	return allowedRoutes.some(route => {
		if (route === pathname) return true
		return pathname.startsWith(route + '/') || pathname.startsWith(route)
	})
}
export const getUserAccessibleRoutes = (userRole: UserRole): string[] => {
	return ROLE_ROUTES_MAP[userRole] || []
}
