import { useAlertStore } from '@/store/alert.store'
import type { IAxiosError } from '@/types/error.interface'
import { parseBackendError } from '../errorHandler'
import { api } from './axiosInstances'

export function getSubdomainFromHost(host: string): string | null {
	const hostname = (host.split(':')[0] ?? '').trim()
	if (!hostname) return null
	if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null
	if (hostname === 'localhost' || hostname.endsWith('.localhost')) return null
	const parts = hostname.split('.')
	const subdomain = parts[0]
	if (!subdomain) return null
	const reserved = ['www', 'api', 'lvh']
	if (reserved.includes(subdomain.toLowerCase())) return null
	return subdomain
}

export function getSubdomainFromHostname(): string | null {
	if (typeof window === 'undefined') return null

	const hostname = window.location.hostname
	if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null
	if (hostname === 'localhost' || hostname.endsWith('.localhost')) return null

	const parts = hostname.split('.')
	const subdomain = parts[0]
	if (!subdomain) return null
	const reserved = ['www', 'api', 'lvh']
	if (reserved.includes(subdomain.toLowerCase())) return null
	return subdomain
}

export function getRootAppUrl(): string {
	const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
	const useHttpAndPort = rootDomain === 'localhost' || rootDomain === 'lvh.me'
	if (typeof window !== 'undefined') {
		const port = window.location.port || '3001'
		return useHttpAndPort
			? `http://${rootDomain}:${port}`
			: `https://${rootDomain}`
	}
	return useHttpAndPort
		? `http://${rootDomain}:3001`
		: `https://${rootDomain}`
}

export function setApiSubdomain(subdomain?: string | null): void {
	const apiBase = process.env.NEXT_PUBLIC_API_URL ?? ''

	const hostnameSubdomain = getSubdomainFromHostname()
	const actualSubdomain = subdomain ?? hostnameSubdomain

	if (!actualSubdomain) {
		api.defaults.baseURL = apiBase
		return
	}

	// Same-origin BFF: on client with subdomain, use Next.js /api so cookies work
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
	const subdomainFromHostname = getSubdomainFromHostname()
	const subdomain = subdomainFromHostname

	if (subdomain) setApiSubdomain(subdomain)
	api.defaults.withCredentials = true
}

export const initApiFromCookies = initApiSubdomain

export function getCompanyUrl(subdomain: string): string {
	const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'localhost'
	const useHttpAndPort = rootDomain === 'localhost' || rootDomain === 'lvh.me'
	if (typeof window !== 'undefined') {
		const port = window.location.port || '3001'
		return useHttpAndPort
			? `http://${subdomain}.${rootDomain}:${port}`
			: `https://${subdomain}.${rootDomain}`
	}
	return useHttpAndPort
		? `http://${subdomain}.${rootDomain}:3001`
		: `https://${subdomain}.${rootDomain}`
}
