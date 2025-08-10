import { API_URL } from '@/config/api'
import type { ILogin } from '@/types/login.interface'
import api from '@/utils/api'

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
	localStorage.setItem('subdomain', data.subdomain)
	const response = await api.post(API_URL.AUTH.LOGIN, {
		email: data.email,
		password: data.password,
	})
	console.log(response)

	return response.data
}
