import { AUTH } from '@/constants/auth.constant'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAlertStore } from '@/store/alert.store'
import { useAuthStore } from '@/store/auth.store'
import type { IUser } from '@/types/user.interface'

const AUTH_STORAGE_KEY = 'user-storage'

export function handleSessionInvalid(options?: {
	showExpiredAlert?: boolean
}): void {
	if (typeof window === 'undefined') return

	clearAuth()
	try {
		getSupabaseClient().auth.signOut()
	} catch {
		// ignore
	}
	if (options?.showExpiredAlert) {
		useAlertStore.getState().setPendingAlert({
			severity: 'warning',
			text: AUTH.SESSION_EXPIRED_MESSAGE,
		})
	}
	const pathname = window.location.pathname
	const loginUrl = `${ROUTES.PUBLIC.AUTH.LOGIN}?redirect=${encodeURIComponent(pathname)}`
	window.location.href = loginUrl
}

export function initializeAuth(user: IUser, role?: UserRole): void {
	const { setUser, setIsAuth, setUserRole } = useAuthStore.getState()
	setUser(user)
	setIsAuth(true)
	if (role) {
		setUserRole(role)
	}
}

export function clearAuth(): void {
	const { setUser, setIsAuth, setUserRole } = useAuthStore.getState()
	setUser(null)
	setIsAuth(false)
	setUserRole(null)
	if (typeof window !== 'undefined') {
		try {
			window.localStorage.setItem(
				AUTH_STORAGE_KEY,
				JSON.stringify({
					state: { user: null, isAuth: false, userRole: null },
					version: 0,
				}),
			)
		} catch {
			// ignore storage errors
		}
	}
}
