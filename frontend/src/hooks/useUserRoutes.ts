import { ALL_ROUTES } from '@/constants/pages.constant'
import { useAuthStore } from '@/store/auth.store'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export const useUserRoutes = () => {
	const { userRole } = useAuthStore()
	const pathname = usePathname()

	const userRoutes = useMemo(() => {
		if (!userRole) return []
		return ALL_ROUTES.filter(route => route.roles.includes(userRole))
	}, [userRole])

	const currentRoute = useMemo(() => {
		return userRoutes.find(route => route.path === pathname) || null
	}, [pathname, userRoutes])

	return {
		routes: userRoutes,
		currentRoute,
	}
}
