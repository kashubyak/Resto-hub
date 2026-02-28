'use client'
import { AUTH } from '@/constants/auth.constant'
import { ROUTES, UserRole } from '@/constants/pages.constant'
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
import { usePathname } from 'next/navigation'
import {
    createContext,
    memo,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react'

const AuthContext = createContext<IAuthContext>({
	user: null,
	isAuth: false,
	login: async () => {},
	logout: async () => {},
	isFetchingUser: false,
})

const CLEAR_AUTH_DEBOUNCE_MS = 500
const GET_CURRENT_USER_RETRY_ATTEMPTS = 3
const GET_CURRENT_USER_RETRY_DELAY_MS = 300

export const AuthProvider = memo<{ children: ReactNode }>(({ children }) => {
	const pathname = usePathname()
	const { user, isAuth, hydrated, clearAuth, setUserRole } = useAuthStore()
	const setUser = useAuthStore.getState().setUser
	const setIsAuth = useAuthStore.getState().setIsAuth
	const { setPendingAlert } = useAlertStore()
	const clearAuthTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const [isFetchingUser, setIsFetchingUser] = useState(false)

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
		if (clearAuthTimeoutRef.current) {
			clearTimeout(clearAuthTimeoutRef.current)
			clearAuthTimeoutRef.current = null
		}
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

	const fetchCurrentUserWithRetry = useCallback(async () => {
		if (isFetchingUser) return
		setIsFetchingUser(true)

		for (let attempt = 0; attempt < GET_CURRENT_USER_RETRY_ATTEMPTS; attempt++) {
			if (attempt > 0)
				await new Promise((r) => setTimeout(r, GET_CURRENT_USER_RETRY_DELAY_MS))

			try {
				const current = await getCurrentUser()
				initializeAuth(current.data, current.data.role as UserRole)
				setIsFetchingUser(false)
				return
			} catch (err) {
				if (attempt === GET_CURRENT_USER_RETRY_ATTEMPTS - 1) {
					setIsFetchingUser(false)
					throw err
				}
			}
		}
	}, [isFetchingUser])

	useEffect(() => {
		if (!hydrated) return

		if (clearAuthTimeoutRef.current) {
			clearTimeout(clearAuthTimeoutRef.current)
			clearAuthTimeoutRef.current = null
		}

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

		const checkBackendAuth = () => {
			return (
				typeof window !== 'undefined' &&
				(Cookies.get(AUTH.AUTH_STATUS) === 'true' ||
					!!Cookies.get(AUTH.TOKEN))
			)
		}

		const hasBackendAuth = checkBackendAuth()
		const isPublicAuthRoute =
			pathname === ROUTES.PUBLIC.AUTH.REGISTER ||
			pathname === ROUTES.PUBLIC.AUTH.LOGIN ||
			pathname === ROUTES.PUBLIC.AUTH.REGISTER_SUCCESS

		if (isPublicAuthRoute && !hasBackendAuth) {
			clearAuth()
			return
		}

		if (!hasBackendAuth && user && !isFetchingUser) {
			clearAuthTimeoutRef.current = setTimeout(() => {
				const stillNoAuth = !checkBackendAuth()
				if (stillNoAuth && user) {
					clearAuth()
				}
				clearAuthTimeoutRef.current = null
			}, CLEAR_AUTH_DEBOUNCE_MS)
		}

		if (!user && hasBackendAuth && !isPublicAuthRoute && !isFetchingUser) {
			initApiSubdomain()
			void fetchCurrentUserWithRetry().catch(() => {
				// 401 etc. handled by interceptor via handleSessionInvalid
			})
		}

		return () => {
			if (clearAuthTimeoutRef.current) {
				clearTimeout(clearAuthTimeoutRef.current)
				clearAuthTimeoutRef.current = null
			}
		}
	}, [
		hydrated,
		user,
		pathname,
		clearAuth,
		setPendingAlert,
		isFetchingUser,
		fetchCurrentUserWithRetry,
	])

	const contextValue = useMemo(
		() => ({
			user,
			isAuth,
			login,
			logout,
			isFetchingUser,
		}),
		[user, isAuth, login, logout, isFetchingUser],
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
