import type { UserRole } from '@/constants/pages.constant'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { memo, useMemo, type JSX, type ReactNode } from 'react'

interface IRoleGuardProps {
	allowedRoles: UserRole | UserRole[]
	children: ReactNode
	fallback?: ReactNode
}

export const RoleGuard = memo<IRoleGuardProps>(
	({ allowedRoles, children, fallback = null }) => {
		const { userRole } = useCurrentUser()
		const roles = useMemo(
			() => (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]),
			[allowedRoles],
		)

		const hasAccess = useMemo(() => {
			if (!userRole) return false
			return roles.includes(userRole)
		}, [userRole, roles])

		if (!userRole) return fallback as JSX.Element
		return hasAccess ? (children as JSX.Element) : (fallback as JSX.Element)
	},
)

RoleGuard.displayName = 'RoleGuard'
