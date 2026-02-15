import { ROLE_ROUTES_MAP, UserRole } from '@/constants/pages.constant'


export const hasRoleAccess = (userRole: UserRole | string, pathname: string): boolean => {
	const role = userRole as UserRole
	const allowedRoutes = ROLE_ROUTES_MAP[role]
	if (!allowedRoutes) return false
	if (allowedRoutes.includes(pathname)) return true
	return allowedRoutes.some(route => pathname.startsWith(route + '/'))
}

export const getUserAccessibleRoutes = (userRole: UserRole | string): string[] => {
	return ROLE_ROUTES_MAP[userRole as UserRole] ?? []
}
