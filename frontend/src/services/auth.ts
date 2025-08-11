import { API_URL } from '@/config/api'
import { AUTH } from '@/constants/auth'
import type { ILogin } from '@/types/login.interface'
import api from '@/utils/api'
import { convertToDays } from '@/utils/convertToDays'
import Cookies from 'js-cookie'

export const registerCompany = async (formData: FormData) => {
	const response = await api.post(API_URL.AUTH.REGISTER, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
		withCredentials: true,
	})
	console.log(response)
	return response.data
}

export const login = async (data: ILogin) => {
	Cookies.set(AUTH.SUBDOMAIN, data.subdomain, { expires: 365 })

	const response = await api.post(API_URL.AUTH.LOGIN, {
		email: data.email,
		password: data.password,
	})

	if (response.data?.token) {
		const TOKEN_EXPIRES_IN = process.env.NEXT_PUBLIC_JWT_EXPIRES_IN || '1d'
		Cookies.set(AUTH.TOKEN, response.data.token, {
			expires: convertToDays(TOKEN_EXPIRES_IN),
		})
	}

	return response
}
