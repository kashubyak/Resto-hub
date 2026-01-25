import { AUTH } from '@/constants/auth.constant'
import { UserRole } from '@/constants/pages.constant'
import { useAuthStore } from '@/store/auth.store'
import type { IUser } from '@/types/user.interface'
import Cookies from 'js-cookie'

/**
 * Initialize auth state after successful login.
 * Called when we have user data from the API.
 */
export function initializeAuth(user: IUser, role?: UserRole): void {
	const { setUser, setIsAuth, setUserRole } = useAuthStore.getState()
	setUser(user)
	setIsAuth(true)
	if (role) {
		setUserRole(role)
	}
}

/**
 * Clear all auth state.
 * Called on logout or when auth fails.
 */
export function clearAuth(): void {
	const { setUser, setIsAuth, setUserRole } = useAuthStore.getState()
	setUser(null)
	setIsAuth(false)
	setUserRole(null)

	// Clear the subdomain cookie (not managed by backend)
	Cookies.remove(AUTH.SUBDOMAIN)
}
