import { API_URL } from '@/config/api'
import { AUTH } from '@/constants/auth.constant'
import { ROUTES } from '@/constants/pages.constant'
import { refreshToken } from '@/services/auth.service'
import { useAlertStore } from '@/store/alert.store'
import type { AlertSeverity } from '@/types/alert.interface'
import type { IAxiosError } from '@/types/error.interface'
import axios from 'axios'
import Cookies from 'js-cookie'
import { convertToDays } from './convertToDays'
import { parseBackendError } from './errorHandler'

let globalShowAlert: ((severity: AlertSeverity, text: string | string[]) => void) | null =
	null

export function setGlobalAlertFunction(
	showAlert: (severity: AlertSeverity, text: string | string[]) => void,
) {
	globalShowAlert = showAlert
}

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	withCredentials: true,
})

export const refreshApi = axios.create({
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
	response => {
		if (response.config.url?.includes(API_URL.AUTH.LOGIN))
			globalShowAlert?.('success', 'Successfully logged in.')
		if (response.config.url?.includes(API_URL.AUTH.REGISTER))
			globalShowAlert?.('success', 'Account created successfully.')

		return response
	},
	async error => {
		const originalRequest = error.config
		if (error.response?.status === 401 && !originalRequest._retry) {
			if (originalRequest.url?.includes(API_URL.AUTH.REFRESH)) {
				if (typeof window !== 'undefined') {
					Cookies.remove(AUTH.TOKEN)
					Cookies.remove(AUTH.SUBDOMAIN)
					useAlertStore.getState().setPendingAlert({
						severity: 'warning',
						text: 'Your session has expired. Please log in again.',
					})
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
					const tokenExpiresInDays = convertToDays(
						process.env.NEXT_PUBLIC_JWT_EXPIRES_IN || '1d',
					)
					Cookies.set(AUTH.TOKEN, newToken, {
						expires: tokenExpiresInDays,
						secure: process.env.NODE_ENV === 'production',
						sameSite: 'strict',
					})

					api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
					processQueue(null, newToken)
					originalRequest.headers['Authorization'] = `Bearer ${newToken}`

					globalShowAlert?.('info', 'Session refreshed successfully.')
					return api(originalRequest)
				}
			} catch (err) {
				processQueue(err, null)
				if (typeof window !== 'undefined') {
					Cookies.remove(AUTH.TOKEN)
					Cookies.remove(AUTH.SUBDOMAIN)
					const currentPath = window.location.pathname
					const loginUrl = `${ROUTES.PUBLIC.AUTH.LOGIN}?redirect=${encodeURIComponent(
						currentPath,
					)}`
					try {
						useAlertStore.getState().setPendingAlert({
							severity: 'error',
							text: parseBackendError(err as IAxiosError).join('\n'),
						})
					} catch {
						useAlertStore.getState().setPendingAlert({
							severity: 'warning',
							text: 'Your session has expired. Redirecting to login page.',
						})
					}
					window.location.href = loginUrl
				}
				return Promise.reject(err)
			} finally {
				isRefreshing = false
			}
		}

		if (typeof window !== 'undefined') {
			const status = error.response?.status
			const shouldShowAlert =
				status !== 401 &&
				!originalRequest.url?.includes(API_URL.AUTH.LOGIN) &&
				!originalRequest.url?.includes(API_URL.AUTH.REGISTER) &&
				!originalRequest._hideGlobalError
			if (shouldShowAlert)
				useAlertStore.getState().setPendingAlert({
					severity: 'error',
					text: parseBackendError(error as IAxiosError).join('\n'),
				})
		}
		if (!error.response)
			useAlertStore.getState().setPendingAlert({
				severity: 'error',
				text: parseBackendError(error as IAxiosError).join('\n'),
			})
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
	} catch (error) {
		api.defaults.baseURL = apiBase
		useAlertStore.getState().setPendingAlert({
			severity: 'error',
			text: parseBackendError(error as IAxiosError).join('\n'),
		})
	}
}

export function initApiFromCookies() {
	const subdomain = Cookies.get(AUTH.SUBDOMAIN)
	if (subdomain) setApiSubdomain(subdomain)
	const token = Cookies.get(AUTH.TOKEN)
	if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default api
