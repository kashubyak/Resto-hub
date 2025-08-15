'use client'

import { AUTH } from '@/constants/auth'
import { login as loginRequest } from '@/services/auth.service'
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
		// make api to logout
		Cookies.remove(AUTH.TOKEN)
		Cookies.remove(AUTH.SUBDOMAIN)
		setUser(null)
		setIsAuth(false)
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
