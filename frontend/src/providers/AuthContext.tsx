'use client'
import { AUTH } from '@/constants/auth.constant'
import { ROUTES } from '@/constants/pages.constant'
import { login as loginRequest, logout as logoutRequest } from '@/services/auth.service'
import { getCurrentUser } from '@/services/user.service'
import { useAuthStore } from '@/store/auth.store'
import type { IAuthContext, ILogin } from '@/types/login.interface'
import { initApiFromCookies } from '@/utils/api'
import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, type ReactNode } from 'react'

const AuthContext = createContext<IAuthContext>({
	user: null,
	isAuth: false,
	login: async () => {},
	logout: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const { user, isAuth, setUser, setIsAuth, hydrated } = useAuthStore()

	const login = async (data: ILogin) => {
		const response = await loginRequest(data)
		if (response.status === 200) {
			initApiFromCookies()
			const currentUser = await getCurrentUser()
			setUser(currentUser.data)
			setIsAuth(true)
		}
	}

	const logout = async () => {
		try {
			await logoutRequest()
			Cookies.remove(AUTH.TOKEN)
			Cookies.remove(AUTH.SUBDOMAIN)
			setUser(null)
			setIsAuth(false)
			window.location.href = ROUTES.PUBLIC.AUTH.LOGIN
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (!hydrated) return
		if (!user && Cookies.get(AUTH.TOKEN)) {
			initApiFromCookies()
			getCurrentUser()
				.then(current => {
					setUser(current.data)
					setIsAuth(true)
				})
				.catch(() => {
					setUser(null)
					setIsAuth(false)
				})
		}
	}, [hydrated, user, setUser, setIsAuth])

	const value = { user, isAuth, login, logout }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
