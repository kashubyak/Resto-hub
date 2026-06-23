const LOCAL_DEV_BACKEND_PORT = 3000

function stripApiSuffix(url: string): string {
	return url.replace(/\/api\/?$/, '')
}

function isLocalDevHostname(hostname: string): boolean {
	if (hostname === 'localhost' || hostname === '127.0.0.1') return true
	return hostname.endsWith('.lvh.me') || hostname === 'lvh.me'
}

function getLocalDevSocketUrl(): string {
	return `http://localhost:${LOCAL_DEV_BACKEND_PORT}`
}

export function getSocketServerUrl(): string | null {
	const fromEnv = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.trim()
	if (fromEnv) return fromEnv

	const apiUrl = process.env.NEXT_PUBLIC_API_URL?.trim()
	if (apiUrl) return stripApiSuffix(apiUrl)

	if (typeof window === 'undefined') return null

	const hostname = window.location.hostname
	if (isLocalDevHostname(hostname)) return getLocalDevSocketUrl()

	return null
}
