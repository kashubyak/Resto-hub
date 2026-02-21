import { API_URL } from '@/config/api'
import { AUTH } from '@/constants/auth.constant'
import {
	completeNetworkRequest,
	failNetworkRequest,
	startNetworkRequest,
	updateNetworkProgress,
} from '@/hooks/useNetworkProgress'
import { getSupabaseClient } from '@/lib/supabase/client'
import { useAlertStore } from '@/store/alert.store'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { IAxiosError } from '@/types/error.interface'
import type { AxiosProgressEvent } from 'axios'
import { handleSessionInvalid } from '../auth-helpers'
import { getRetryAfter, parseBackendError } from '../errorHandler'
import Cookies from 'js-cookie'
import {
	getIsRefreshing,
	processQueue,
	pushToQueue,
	setIsRefreshing,
} from './authQueue'
import { api } from './axiosInstances'
import { getGlobalShowAlert } from './globalAlert'

api.interceptors.request.use(async (config) => {
	const requestId = startNetworkRequest(config.url || 'unknown')
	config.headers['X-Request-ID'] = requestId

	config.onDownloadProgress = (event: AxiosProgressEvent) => {
		updateNetworkProgress(
			requestId,
			event.loaded ?? 0,
			event.total ?? undefined,
		)
	}

	config.withCredentials = true

	if (typeof window !== 'undefined') {
		try {
			const token = Cookies.get(AUTH.TOKEN)
			if (token) {
				config.headers.Authorization = `Bearer ${token}`
			} else {
				const {
					data: { session },
				} = await getSupabaseClient().auth.getSession()
				if (session?.access_token)
					config.headers.Authorization = `Bearer ${session.access_token}`
			}
		} catch {}
	}

	return config
})

api.interceptors.response.use(
	(response) => {
		const requestId = response.config.headers['X-Request-ID'] as string
		if (requestId) completeNetworkRequest(requestId)

		if (response.config.url?.includes(API_URL.AUTH.LOGIN))
			getGlobalShowAlert()?.('success', 'Successfully logged in.')
		if (response.config.url?.includes(API_URL.AUTH.REGISTER))
			getGlobalShowAlert()?.('success', 'Account created successfully.')

		return response
	},
	async (error) => {
		const requestId = error.config?.headers?.['X-Request-ID'] as string
		if (requestId) failNetworkRequest(requestId)

		const originalRequest = error.config as CustomAxiosRequestConfig
		const shouldHideGlobalError = originalRequest?._hideGlobalError === true

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (originalRequest.url?.includes(API_URL.AUTH.LOGOUT)) {
				return Promise.reject(error)
			}
			if (getIsRefreshing()) {
				return new Promise((resolve, reject) => {
					pushToQueue(resolve, reject)
				})
					.then(() => {
						originalRequest.headers = originalRequest.headers || {}
						originalRequest.headers['X-Request-ID'] = startNetworkRequest(
							originalRequest.url || 'retry',
						)
						return api(originalRequest)
					})
					.catch((err) => Promise.reject(err))
			}

			originalRequest._retry = true
			setIsRefreshing(true)

			try {
				try {
					const backendRefreshRes = await api.post<{
						success: boolean
						token?: string
					}>(API_URL.AUTH.REFRESH, {}, { withCredentials: true })
					if (
						backendRefreshRes?.status >= 200 &&
						backendRefreshRes?.status < 300
					) {
						processQueue(null, null)
						originalRequest.headers = originalRequest.headers || {}
						originalRequest.headers['X-Request-ID'] =
							startNetworkRequest(originalRequest.url || 'retry')
						return api(originalRequest)
					}
				} catch {
					// backend refresh failed
				}

				processQueue(new Error('Session refresh failed'), null)
				if (typeof window !== 'undefined') {
					handleSessionInvalid({
						showExpiredAlert: !sessionStorage.getItem(
							AUTH.SESSION_EXPIRED_SHOWN_KEY,
						),
					})
				}
				return Promise.reject(error)
			} finally {
				setIsRefreshing(false)
			}
		}

		if (error.response?.status === 429) {
			const retryAfter = getRetryAfter(error as IAxiosError)
			const errorMessage = parseBackendError(error as IAxiosError).join('\n')

			useAlertStore.getState().setPendingAlert({
				severity: 'error',
				text: errorMessage,
				...(retryAfter !== null && { retryAfter }),
			})

			return Promise.reject(error)
		}

		if (typeof window !== 'undefined') {
			const status = error.response?.status
			const shouldShowAlert =
				status !== 401 &&
				status !== 429 &&
				!originalRequest.url?.includes(API_URL.AUTH.LOGIN) &&
				!originalRequest.url?.includes(API_URL.AUTH.REGISTER) &&
				!shouldHideGlobalError

			if (shouldShowAlert) {
				useAlertStore.getState().setPendingAlert({
					severity: 'error',
					text: parseBackendError(error as IAxiosError).join('\n'),
				})
			}
		}

		if (!error.response && !shouldHideGlobalError) {
			useAlertStore.getState().setPendingAlert({
				severity: 'error',
				text: parseBackendError(error as IAxiosError).join('\n'),
			})
		}

		if (error.response?.status === 401) return Promise.reject(error)
		return Promise.reject(error)
	},
)
