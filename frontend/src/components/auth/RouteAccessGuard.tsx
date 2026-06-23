'use client'

import {
	getDefaultRouteForRole,
	hasRoleAccess,
} from '@/lib/middleware/role-guards'
import { isAuthRoute, isPublicRoute } from '@/lib/middleware/route-guards'
import { useAuth } from '@/providers/AuthContext'
import { useAuthStore } from '@/store/auth.store'
import { usePathname, useRouter } from 'next/navigation'
import { memo, useEffect, type ReactNode } from 'react'

interface RouteAccessGuardProps {
	children: ReactNode
}

function isProtectedRoute(pathname: string): boolean {
	return !isPublicRoute(pathname) && !isAuthRoute(pathname)
}

const RouteAccessGuardComponent = ({ children }: RouteAccessGuardProps) => {
	const pathname = usePathname()
	const router = useRouter()
	const { isAuth, isFetchingUser } = useAuth()
	const hydrated = useAuthStore((state) => state.hydrated)
	const userRole = useAuthStore((state) => state.userRole)

	const skipCheck = isPublicRoute(pathname) || isAuthRoute(pathname)
	const protectedRoute = isProtectedRoute(pathname)

	useEffect(() => {
		if (skipCheck || !hydrated || !isAuth || !userRole) return
		if (hasRoleAccess(userRole, pathname)) return
		router.replace(getDefaultRouteForRole(userRole))
	}, [skipCheck, hydrated, isAuth, userRole, pathname, router])

	if (skipCheck) return children

	if (!hydrated) return null

	if (protectedRoute && isAuth && isFetchingUser && !userRole) return null

	if (
		protectedRoute &&
		isAuth &&
		userRole &&
		!hasRoleAccess(userRole, pathname)
	)
		return null

	return children
}

export const RouteAccessGuard = memo(RouteAccessGuardComponent)

RouteAccessGuard.displayName = 'RouteAccessGuard'
