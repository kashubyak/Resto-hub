'use client'
import { AUTH } from '@/constants/auth.constant'
import { ROUTES, UserRole } from '@/constants/pages.constant'
import { getSupabaseClient } from '@/lib/supabase/client'
import { usePathname } from 'next/navigation'
import {
	login as loginRequest,
	logout as logoutRequest,
} from '@/services/auth/auth.service'
import { getCurrentUser } from '@/services/user/user.service'
import { useAlertStore } from '@/store/alert.store'
import { useAuthStore } from '@/store/auth.store'
import type { IAuthContext, ILoginRequest } from '@/types/auth.interface'
import type { IUser } from '@/types/user.interface'
import { initApiSubdomain } from '@/utils/api'
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
	const pathname = usePathname()
	const { user, isAuth, hydrated, clearAuth, setUserRole } = useAuthStore()
	const setUser = useAuthStore.getState().setUser
	const setIsAuth = useAuthStore.getState().setIsAuth
	const { setPendingAlert } = useAlertStore()

	const login = useCallback(
		async (data: ILoginRequest, options?: { skipGetCurrentUser?: boolean }) => {
			const response = await loginRequest(data)
			if (response.status === 200 && response.data.success) {
				if (typeof window !== 'undefined')
					sessionStorage.removeItem(AUTH.SESSION_EXPIRED_SHOWN_KEY)
				initApiSubdomain()

				if (response.data.user?.role)
					setUserRole(response.data.user.role as UserRole)

				if (options?.skipGetCurrentUser) {
					const u = response.data.user
					if (u) {
						setIsAuth(true)
						setUser({
							id: String(u.id),
							name: '',
							email: '',
							role: u.role as UserRole,
							avatarUrl: null,
							createdAt: '',
							updatedAt: '',
						} as IUser)
					}
					return
				}

				const currentUser = await getCurrentUser()
				initializeAuth(currentUser.data, currentUser.data.role as UserRole)
			}
		},
		[setUserRole],
	)

	const logout = useCallback(async () => {
		try {
			const response = await logoutRequest()
			clearAuth()

			setPendingAlert({
				severity: 'success',
				text: response.data.message,
			})
			window.location.href = ROUTES.PUBLIC.AUTH.LOGIN
		} catch {
			clearAuth()
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
				if (
					alertObj.text === AUTH.SESSION_EXPIRED_MESSAGE &&
					typeof window !== 'undefined' &&
					sessionStorage.getItem(AUTH.SESSION_EXPIRED_SHOWN_KEY)
				) {
				} else {
					setPendingAlert(alertObj)
				}
			} catch {
			} finally {
				Cookies.remove('pending-alert')
			}
		}

		void getSupabaseClient()
			.auth.getSession()
			.then(({ data: { session } }) => {
				const hasBackendAuth =
					typeof window !== 'undefined' &&
					(Cookies.get(AUTH.AUTH_STATUS) === 'true' ||
						!!Cookies.get(AUTH.TOKEN))
				const isAuthenticated = !!session || !!hasBackendAuth
				const isPublicAuthRoute =
					pathname === ROUTES.PUBLIC.AUTH.REGISTER ||
					pathname === ROUTES.PUBLIC.AUTH.LOGIN ||
					pathname === ROUTES.PUBLIC.AUTH.REGISTER_SUCCESS
				if (isPublicAuthRoute && !hasBackendAuth) clearAuth()
				if (!user && isAuthenticated && !isPublicAuthRoute) {
					initApiSubdomain()
					return getCurrentUser()
						.then((current) =>
							initializeAuth(current.data, current.data.role as UserRole),
						)
						.catch(() => {
							if (!isPublicAuthRoute) clearAuth()
						})
				}
				if (!isAuthenticated && user) clearAuth()
				return undefined
			})
			.catch(() => {
				clearAuth()
			})
	}, [hydrated, user, pathname, clearAuth, setPendingAlert])

	const contextValue = useMemo(
		() => ({
			user,
			isAuth,
			login,
			logout,
		}),
		[user, isAuth, login, logout],
	)

	return (
		<AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
	)
})

AuthProvider.displayName = 'AuthProvider'

export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) throw new Error('useAuth must be used within AuthProvider')
	return context
}
