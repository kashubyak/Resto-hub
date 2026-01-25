import { API_URL } from '@/config/api'
import { AUTH } from '@/constants/auth.constant'
import { ROUTES } from '@/constants/pages.constant'
import {
	completeNetworkRequest,
	failNetworkRequest,
	startNetworkRequest,
	updateNetworkProgress,
} from '@/hooks/useNetworkProgress'
import { refreshToken } from '@/services/auth/auth.service'
import { useAlertStore } from '@/store/alert.store'
import type { CustomAxiosRequestConfig } from '@/types/axios.interface'
import type { IAxiosError } from '@/types/error.interface'
import type { AxiosProgressEvent } from 'axios'
import Cookies from 'js-cookie'
import { clearAuth } from '../auth-helpers'
import { getRetryAfter, parseBackendError } from '../errorHandler'
import { getIsRefreshing, processQueue, pushToQueue, setIsRefreshing } from './authQueue'
import { api } from './axiosInstances'
import { getGlobalShowAlert } from './globalAlert'

api.interceptors.request.use(config => {
	const requestId = startNetworkRequest(config.url || 'unknown')
	config.headers['X-Request-ID'] = requestId

	config.onDownloadProgress = (event: AxiosProgressEvent) => {
		updateNetworkProgress(requestId, event.loaded ?? 0, event.total ?? undefined)
	}

	config.withCredentials = true

	return config
})

api.interceptors.response.use(
	response => {
		const requestId = response.config.headers['X-Request-ID'] as string
		if (requestId) completeNetworkRequest(requestId)

		if (response.config.url?.includes(API_URL.AUTH.LOGIN))
			getGlobalShowAlert()?.('success', 'Successfully logged in.')
		if (response.config.url?.includes(API_URL.AUTH.REGISTER))
			getGlobalShowAlert()?.('success', 'Account created successfully.')

		return response
	},
	async error => {
		const requestId = error.config?.headers?.['X-Request-ID'] as string
		if (requestId) failNetworkRequest(requestId)

		const originalRequest = error.config as CustomAxiosRequestConfig
		const shouldHideGlobalError = originalRequest?._hideGlobalError === true

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (originalRequest.url?.includes(API_URL.AUTH.REFRESH)) {
				if (typeof window !== 'undefined') {
					Cookies.remove(AUTH.SUBDOMAIN)
					clearAuth()
					useAlertStore.getState().setPendingAlert({
						severity: 'warning',
						text: 'Your session has expired. Please log in again.',
					})
					window.location.href = ROUTES.PUBLIC.AUTH.LOGIN
				}
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
					.catch(err => Promise.reject(err))
			}

			originalRequest._retry = true
			setIsRefreshing(true)

			try {
				const { data } = await refreshToken()

				if (data.success) {
					processQueue(null, null)

					originalRequest.headers = originalRequest.headers || {}
					originalRequest.headers['X-Request-ID'] = startNetworkRequest(
						originalRequest.url || 'refresh-retry',
					)

					return api(originalRequest)
				}

				throw new Error('Token refresh failed')
			} catch (err) {
				processQueue(err, null)

				if (typeof window !== 'undefined') {
					Cookies.remove(AUTH.SUBDOMAIN)
					clearAuth()

					const currentPath = window.location.pathname
					const loginUrl = `${ROUTES.PUBLIC.AUTH.LOGIN}?redirect=${encodeURIComponent(
						currentPath,
					)}`

					useAlertStore.getState().setPendingAlert({
						severity: 'warning',
						text: 'Your session has expired. Redirecting to login page.',
					})

					window.location.href = loginUrl
				}

				return Promise.reject(err)
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

		return Promise.reject(error)
	},
)
