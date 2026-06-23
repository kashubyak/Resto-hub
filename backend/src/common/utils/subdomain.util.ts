const RESERVED_SUBDOMAINS = ['www', 'api', 'localhost', 'lvh']

export function getSubdomainFromHost(host: string): string | null {
	const hostPart = (host.split(':')[0] ?? '').trim()
	if (!hostPart) return null

	const subdomain = hostPart.split('.')[0] ?? ''
	if (!subdomain || RESERVED_SUBDOMAINS.includes(subdomain)) return null
	return subdomain
}
