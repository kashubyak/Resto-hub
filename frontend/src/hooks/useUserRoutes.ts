import { ALL_ROUTES, ROLE_ROUTES_MAP } from '@/constants/pages.constant'
import { useAuthStore } from '@/store/auth.store'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export const useUserRoutes = () => {
	const { userRole } = useAuthStore()
	const pathname = usePathname()

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

	const currentRoute = useMemo(() => {
		return userRoutes.find(route => route.path === pathname) || null
	}, [pathname, userRoutes])

	return {
		routes: userRoutes,
		hasAccess,
		currentRoute,
	}
}
