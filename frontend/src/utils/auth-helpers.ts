import { useAuthStore } from '@/store/auth.store'
import type { IUser } from '@/types/login.interface'

export function initializeAuth(user: IUser) {
	const { setUser, setIsAuth, updateUserFromToken } = useAuthStore.getState()
	setUser(user)
	setIsAuth(true)
	updateUserFromToken()
}

export function clearAuth() {
	const { setUser, setIsAuth, setUserRole, setTokenValidUntil } = useAuthStore.getState()
	setUser(null)
	setIsAuth(false)
	setUserRole(null)
	setTokenValidUntil(null)
}
