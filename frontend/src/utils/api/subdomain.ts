import { AUTH } from '@/constants/auth.constant'
import { useAlertStore } from '@/store/alert.store'
import type { IAxiosError } from '@/types/error.interface'
import Cookies from 'js-cookie'
import { parseBackendError } from '../errorHandler'
import { api } from './axiosInstances'

export function setApiSubdomain(subdomain?: string): void {
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
		console.error('Failed to set API subdomain:', error)
		api.defaults.baseURL = apiBase

		useAlertStore.getState().setPendingAlert({
			severity: 'error',
			text: parseBackendError(error as IAxiosError).join('\n'),
		})
	}
}

export function initApiFromCookies(): void {
	const subdomain = Cookies.get(AUTH.SUBDOMAIN)
	if (subdomain) setApiSubdomain(subdomain)

	const token = Cookies.get(AUTH.TOKEN)
	if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
