import { AUTH } from '@/constants/auth'
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})

api.interceptors.request.use(config => {
	if (typeof window !== 'undefined') {
		const subdomain = Cookies.get(AUTH.SUBDOMAIN)
		if (subdomain) {
			const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
			const base = new URL(apiBase)
			base.hostname = `${subdomain}.localhost`
			config.baseURL = base.toString()
		}
	}

	const accessToken = Cookies.get(AUTH.TOKEN)
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`
	}

	return config
})

export default api
