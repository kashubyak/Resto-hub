import { ROLE_ROUTES_MAP, type UserRole } from '@/constants/pages.constant'

export const hasRoleAccess = (userRole: UserRole, pathname: string): boolean => {
	const allowedRoutes = ROLE_ROUTES_MAP[userRole]
	if (!allowedRoutes) return false
	if (allowedRoutes.includes(pathname)) return true
	return allowedRoutes.some(route => pathname.startsWith(route + '/'))
}

export const getUserAccessibleRoutes = (userRole: UserRole): string[] => {
	return ROLE_ROUTES_MAP[userRole] ?? []
}
