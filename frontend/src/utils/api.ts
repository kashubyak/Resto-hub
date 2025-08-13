import { API_URL } from '@/config/api'
import { AUTH } from '@/constants/auth'
import { ROUTES } from '@/constants/pages'
import { refreshToken } from '@/services/auth.service'
import axios from 'axios'
import Cookies from 'js-cookie'
import { convertToDays } from './convertToDays'

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

let isRefreshing = false
let failedQueue: {
	resolve: (value?: unknown) => void
	reject: (error?: unknown) => void
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach(prom => {
		if (error) prom.reject(error)
		else prom.resolve(token)
	})
	failedQueue = []
}

api.interceptors.response.use(
	response => response,
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (originalRequest.url?.includes(API_URL.AUTH.REFRESH)) {
				if (typeof window !== 'undefined') {
					Cookies.remove(AUTH.TOKEN)
					window.location.href = ROUTES.PUBLIC.AUTH.LOGIN
				}
				return Promise.reject(error)
			}

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then(token => {
						if (token) {
							originalRequest.headers['Authorization'] = `Bearer ${token}`
						}
						return api(originalRequest)
					})
					.catch(err => Promise.reject(err))
			}

			originalRequest._retry = true
			isRefreshing = true

			try {
				const { token: newToken } = await refreshToken()

				if (newToken) {
					const tokenExpiresIn = process.env.NEXT_PUBLIC_JWT_EXPIRES_IN || '1d'
					Cookies.set(AUTH.TOKEN, newToken, {
						expires: convertToDays(tokenExpiresIn),
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'strict',
					})

					api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
					processQueue(null, newToken)
					originalRequest.headers['Authorization'] = `Bearer ${newToken}`

					return api(originalRequest)
				}
			} catch (err) {
				processQueue(err, null)

				if (typeof window !== 'undefined') {
					Cookies.remove(AUTH.TOKEN)
					const currentPath = window.location.pathname
					const loginUrl = `${ROUTES.PUBLIC.AUTH.LOGIN}?redirect=${encodeURIComponent(
						currentPath,
					)}`
					window.location.href = loginUrl
				}

				return Promise.reject(err)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(error)
	},
)

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
	if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default api
