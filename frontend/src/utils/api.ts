import { AUTH } from '@/constants/auth'
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})

api.interceptors.request.use(config => {
	config.headers = config.headers || {}
	const token = Cookies.get(AUTH.TOKEN)
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

export function setApiSubdomain(subdomain?: string) {
	const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''
	if (!subdomain) {
		api.defaults.baseURL = apiBase
		return
	}

	try {
		const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
		const url = new URL(apiBase)
		url.hostname = `${subdomain}.${rootDomain}`
		api.defaults.baseURL = url.toString()
	} catch (e) {
		console.error('Invalid API base URL', e)
		api.defaults.baseURL = apiBase
	}
}

export function initApiFromCookies() {
	const subdomain = Cookies.get(AUTH.SUBDOMAIN)
	if (subdomain) setApiSubdomain(subdomain)
	const token = Cookies.get(AUTH.TOKEN)
	if (token) {
		api.defaults.headers.common['Authorization'] = `Bearer ${token}`
	}
}

export default api
