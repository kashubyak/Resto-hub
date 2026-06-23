import {
	ROLE_DEFAULT_ROUTE,
	ROLE_ROUTE_PATTERNS,
	ROLE_ROUTES_MAP,
	type UserRole,
} from '@/constants/pages.constant'

export const hasRoleAccess = (
	userRole: UserRole | string,
	pathname: string,
): boolean => {
	const role = userRole as UserRole
	const allowedRoutes = ROLE_ROUTES_MAP[role]
	if (!allowedRoutes) return false
	if (allowedRoutes.includes(pathname)) return true
	if (allowedRoutes.some((route) => pathname.startsWith(route + '/')))
		return true
	const patterns = ROLE_ROUTE_PATTERNS[role]
	return patterns?.some((pattern) => pattern.test(pathname)) ?? false
}

export const getDefaultRouteForRole = (userRole: UserRole): string =>
	ROLE_DEFAULT_ROUTE[userRole]

export const getUserAccessibleRoutes = (
	userRole: UserRole | string,
): string[] => {
	return ROLE_ROUTES_MAP[userRole as UserRole] ?? []
}
