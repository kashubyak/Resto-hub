'use client'
import { AUTH } from '@/constants/auth.constant'
import { ROUTES } from '@/constants/pages.constant'
import {
	login as loginRequest,
	logout as logoutRequest,
} from '@/services/auth/auth.service'
import { getCurrentUser } from '@/services/user/user.service'
import { useAlertStore } from '@/store/alert.store'
import { useAuthStore } from '@/store/auth.store'
import type { IAuthContext, ILogin } from '@/types/login.interface'
import { initApiFromCookies } from '@/utils/api'
import { initializeAuth } from '@/utils/auth-helpers'
import Cookies from 'js-cookie'
import {
	createContext,
	memo,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	type ReactNode,
} from 'react'

const AuthContext = createContext<IAuthContext>({
	user: null,
	isAuth: false,
	login: async () => {},
	logout: async () => {},
})

export const AuthProvider = memo<{ children: ReactNode }>(({ children }) => {
	const { user, isAuth, hydrated, clearAuth } = useAuthStore()
	const { setPendingAlert } = useAlertStore()

	const login = useCallback(async (data: ILogin) => {
		const response = await loginRequest(data)
		if (response.status === 200) {
			initApiFromCookies()
			const currentUser = await getCurrentUser()
			initializeAuth(currentUser.data)
		}
	}, [])

	const logout = useCallback(async () => {
		try {
			const response = await logoutRequest()
			Cookies.remove(AUTH.TOKEN)
			Cookies.remove(AUTH.SUBDOMAIN)
			clearAuth()

			setPendingAlert({
				severity: 'success',
				text: response.data.message,
			})
			window.location.href = ROUTES.PUBLIC.AUTH.LOGIN
		} catch {
			setPendingAlert({
				severity: 'error',
				text: 'Logout failed. Please try again later.',
			})
		}
	}, [clearAuth, setPendingAlert])

	useEffect(() => {
		if (!hydrated) return
		const pending = Cookies.get('pending-alert')
		if (pending) {
			try {
				const alertObj = JSON.parse(decodeURIComponent(pending))
				setPendingAlert(alertObj)
			} catch {
			} finally {
				Cookies.remove('pending-alert')
			}
		}

		if (!user && Cookies.get(AUTH.TOKEN)) {
			initApiFromCookies()
			getCurrentUser()
				.then(current => initializeAuth(current.data))
				.catch(() => clearAuth())
		}
	}, [hydrated, user, clearAuth, setPendingAlert])

	const contextValue = useMemo(
		() => ({
			user,
			isAuth,
			login,
			logout,
		}),
		[user, isAuth, login, logout],
	)

	return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
})

AuthProvider.displayName = 'AuthProvider'

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must be used within AuthProvider')
	return context
}
