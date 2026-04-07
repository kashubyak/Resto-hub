import { AUTH } from '@/constants/auth.constant'
import { UserRole } from '@/constants/pages.constant'
import type { NextRequest } from 'next/server'

function isAppUserRole(value: string): value is UserRole {
	return (Object.values(UserRole) as string[]).includes(value)
}

export function getRoleForMiddleware(request: NextRequest): UserRole | null {
	const fromCookie = request.cookies.get(AUTH.USER_ROLE)?.value
	if (fromCookie && isAppUserRole(fromCookie)) return fromCookie

	const token = request.cookies.get(AUTH.TOKEN)?.value
	if (!token) return null
	return getRoleFromAccessToken(token)
}

export function getRoleFromAccessToken(token: string): UserRole | null {
	try {
		const parts = token.split('.')
		if (parts.length !== 3 || !parts[1]) return null
		const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
		const pad = (4 - (base64.length % 4)) % 4
		const padded = base64 + '='.repeat(pad)
		const json = atob(padded)
		const payload = JSON.parse(json) as { role?: string }
		const role = payload.role
		if (!role) return null
		if ((Object.values(UserRole) as string[]).includes(role))
			return role as UserRole
		return null
	} catch {
		return null
	}
}
