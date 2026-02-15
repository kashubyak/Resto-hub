import { UserRole } from '@/constants/pages.constant'
import { useAuthStore } from '@/store/auth.store'
import type { IUser } from '@/types/user.interface'

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
}
