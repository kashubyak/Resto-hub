import { AUTH } from '@/constants/auth.constant'
import { useAlertStore } from '@/store/alert.store'
import type { IAxiosError } from '@/types/error.interface'
import Cookies from 'js-cookie'
import { parseBackendError } from '../errorHandler'
import { api } from './axiosInstances'

export function getSubdomainFromHostname(): string | null {
	if (typeof window === 'undefined') return null

	const hostname = window.location.hostname
	if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname))
		return null


	const parts = hostname.split('.')

	if (hostname.includes('localhost')) {
		if (parts.length === 1) return null

		const subdomain = parts[0]
		if (!subdomain) return null
		const reserved = ['www', 'api']
		if (reserved.includes(subdomain.toLowerCase())) return null
		return subdomain
	}

	const subdomain = parts[0]
	if (!subdomain) return null
	const reserved = ['www', 'api']
	if (reserved.includes(subdomain.toLowerCase())) return null

	return subdomain
}

export function setApiSubdomain(subdomain?: string | null): void {
	const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

	const hostnameSubdomain = getSubdomainFromHostname()
	const actualSubdomain = subdomain ?? hostnameSubdomain

	if (!actualSubdomain) {
		api.defaults.baseURL = apiBase
		return
	}

	try {
		const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
		const url = new URL(apiBase)
		url.hostname = `${actualSubdomain}.${rootDomain}`
		api.defaults.baseURL = url.toString()
	} catch (error) {
		api.defaults.baseURL = apiBase
		useAlertStore.getState().setPendingAlert({
			severity: 'error',
			text: parseBackendError(error as IAxiosError).join('\n'),
		})
	}
}

export function initApiSubdomain(): void {
	const subdomainFromHostname = getSubdomainFromHostname()
	const subdomainFromCookie = Cookies.get(AUTH.SUBDOMAIN)

	const subdomain = subdomainFromHostname || subdomainFromCookie

	if (subdomain) setApiSubdomain(subdomain)
	api.defaults.withCredentials = true
}

export const initApiFromCookies = initApiSubdomain

export function getCompanyUrl(subdomain: string): string {
	const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
	if (typeof window !== 'undefined') {
		const port = window.location.port || '3001'
		return rootDomain === 'localhost'
			? `http://${subdomain}.${rootDomain}:${port}`
			: `https://${subdomain}.${rootDomain}`
	}
	return rootDomain === 'localhost'
		? `http://${subdomain}.${rootDomain}:3001`
		: `https://${subdomain}.${rootDomain}`
}
