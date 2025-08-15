'use client'

import { AUTH } from '@/constants/auth'
import { ROUTES } from '@/constants/pages'
import { login as loginRequest, logout as logoutRequest } from '@/services/auth.service'
import type { IAuthContext, ILogin, IUser } from '@/types/login.interface'
import { initApiFromCookies } from '@/utils/api'
import Cookies from 'js-cookie'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const AuthContext = createContext<IAuthContext>({
	user: null,
	isAuth: false,
	login: async () => {},
	logout: async () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<IUser | null>(null)
	const [isAuth, setIsAuth] = useState<boolean>(false)

	const login = async (data: ILogin) => {
		const response = await loginRequest(data)
		if (response.data?.user) {
			// save user data to state
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
			window.location.href = `${ROUTES.PUBLIC.AUTH.LOGIN}`
		} catch (error) {
			console.log(error)
		}
	}
	const getUser = async () => {
		// make api to get user
	}
	useEffect(() => {
		initApiFromCookies()
		getUser()
	}, [])
	const value = { user, isAuth, login, logout }

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export const useAuth = () => useContext(AuthContext)
