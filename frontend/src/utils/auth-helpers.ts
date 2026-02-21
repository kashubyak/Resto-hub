import { UserRole } from '@/constants/pages.constant'
import { useAuthStore } from '@/store/auth.store'
import type { IUser } from '@/types/user.interface'

const AUTH_STORAGE_KEY = 'user-storage'

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
