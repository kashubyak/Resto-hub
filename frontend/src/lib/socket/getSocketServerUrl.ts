import { getSubdomainFromHostname } from '@/utils/api/subdomain'

const LOCAL_DEV_BACKEND_PORT = 3000

function stripApiSuffix(url: string): string {
	return url.replace(/\/api\/?$/, '')
}

function isLocalDevHostname(hostname: string): boolean {
	if (hostname === 'localhost' || hostname === '127.0.0.1') return true
	return hostname.endsWith('.lvh.me') || hostname === 'lvh.me'
}

function getBackendPortFromEnv(): number {
	const fromEnv = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.trim()
	if (!fromEnv) return LOCAL_DEV_BACKEND_PORT

	try {
		const url = new URL(fromEnv)
		if (url.port) return Number(url.port)
		return url.protocol === 'https:' ? 443 : 80
	} catch {
		return LOCAL_DEV_BACKEND_PORT
	}
}

function getSubdomainSocketUrl(): string {
	const port = getBackendPortFromEnv()
	const defaultPort = window.location.protocol === 'https:' ? 443 : 80
	const portSuffix = port !== defaultPort ? `:${port}` : ''
	return `${window.location.protocol}//${window.location.hostname}${portSuffix}`
}

function getLocalDevSocketUrl(): string {
	return `http://localhost:${LOCAL_DEV_BACKEND_PORT}`
}

export function getSocketServerUrl(): string | null {
	if (typeof window !== 'undefined' && getSubdomainFromHostname())
		return getSubdomainSocketUrl()

	const fromEnv = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.trim()
	if (fromEnv) return fromEnv

	const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
	if (apiUrl) return stripApiSuffix(apiUrl)

	if (typeof window === 'undefined') return null

	const hostname = window.location.hostname
	if (isLocalDevHostname(hostname)) return getLocalDevSocketUrl()

	return null
}
