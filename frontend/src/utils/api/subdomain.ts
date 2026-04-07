import { ROUTES } from '@/constants/pages.constant'
import { useAlertStore } from '@/store/alert.store'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '../errorHandler'
import { api } from './axiosInstances'

const reserved = ['www', 'api', 'lvh', 'resto-hub']

export function getSubdomainFromHost(host: string): string | null {
	const hostname = (host.split(':')[0] ?? '').trim()
	if (!hostname) return null
	if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null
	if (hostname === 'localhost' || hostname.endsWith('.localhost')) return null

	const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'

	if (hostname === rootDomain) return null
	if (hostname.endsWith(`.${rootDomain}`)) {
		const subdomain = hostname.slice(0, -(rootDomain.length + 1))
		if (!subdomain) return null
		if (reserved.includes(subdomain.toLowerCase())) return null
		return subdomain
	}

	return null
}

export function getSubdomainFromHostname(): string | null {
	if (typeof window === 'undefined') return null

	const hostname = window.location.hostname
	if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null
	if (hostname === 'localhost' || hostname.endsWith('.localhost')) return null

	const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'

	if (hostname === rootDomain) return null
	if (hostname.endsWith(`.${rootDomain}`)) {
		const subdomain = hostname.slice(0, -(rootDomain.length + 1))
		if (!subdomain) return null
		if (reserved.includes(subdomain.toLowerCase())) return null
		return subdomain
	}

	return null
}

export function getRootAppUrl(): string {
	const rawRoot = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
	const rootDomain = rawRoot.replace(/\/+$/, '')
	const isLocalDomain = rootDomain === 'localhost' || rootDomain === 'lvh.me'

	if (typeof window !== 'undefined') {
		if (isLocalDomain) {
			const port = window.location.port || '3001'
			return `http://${rootDomain}:${port}`
		}
		return `https://${rootDomain}`
	}

	if (isLocalDomain) {
		return `http://${rootDomain}:3001`
	}
	return `https://${rootDomain}`
}

export function setApiSubdomain(subdomain?: string | null): void {
	const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

	const hostnameSubdomain = getSubdomainFromHostname()
	const actualSubdomain = subdomain ?? hostnameSubdomain

	if (!actualSubdomain) {
		api.defaults.baseURL = apiBase
		return
	}

	if (typeof window !== 'undefined') {
		api.defaults.baseURL = window.location.origin + '/api'
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
	if (typeof window !== 'undefined') {
		const pathname = window.location.pathname ?? ''
		if (
			pathname === ROUTES.PUBLIC.AUTH.REGISTER ||
			pathname === ROUTES.PUBLIC.AUTH.REGISTER_SUCCESS
		) {
			api.defaults.baseURL = getRootAppUrl() + '/api'
			api.defaults.withCredentials = true
			return
		}
	}

	const subdomainFromHostname = getSubdomainFromHostname()
	const subdomain = subdomainFromHostname

	if (subdomain) setApiSubdomain(subdomain)
	api.defaults.withCredentials = true
}

export const initApiFromCookies = initApiSubdomain

export function getCompanyUrl(subdomain: string): string {
	const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
	const isLocalDomain = rootDomain === 'localhost' || rootDomain === 'lvh.me'

	if (typeof window !== 'undefined') {
		if (isLocalDomain) {
			const port = window.location.port || '3001'
			return `http://${subdomain}.${rootDomain}:${port}`
		}
		return `https://${subdomain}.${rootDomain}`
	}

	if (isLocalDomain) {
		return `http://${subdomain}.${rootDomain}:3001`
	}
	return `https://${subdomain}.${rootDomain}`
}
