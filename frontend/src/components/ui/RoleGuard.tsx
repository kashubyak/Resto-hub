import type { UserRole } from '@/constants/pages.constant'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import type { JSX, ReactNode } from 'react'

interface IRoleGuardProps {
	allowedRoles: UserRole | UserRole[]
	children: ReactNode
	fallback?: ReactNode
}

export const RoleGuard = ({
	allowedRoles,
	children,
	fallback = null,
}: IRoleGuardProps) => {
	const { userRole } = useCurrentUser()
	if (!userRole) return fallback as JSX.Element

	const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
	const hasAccess = roles.includes(userRole)
	return hasAccess ? (children as JSX.Element) : (fallback as JSX.Element)
}
