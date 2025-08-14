import { API_URL } from '@/config/api'
import { NextRequest } from 'next/server'

interface RefreshResult {
	success: boolean
	token?: string
	error?: string
}

export async function refreshAccessToken(
	request: NextRequest,
	subdomain?: string,
): Promise<RefreshResult> {
	try {
		const refreshUrl = buildRefreshUrl(subdomain)

		const response = await fetch(refreshUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: request.headers.get('cookie') || '',
			},
			credentials: 'include',
		})

		if (!response.ok) {
			console.error(`Refresh failed: HTTP ${response.status}`)
			return { success: false, error: `HTTP ${response.status}` }
		}

		const data = await response.json()
		if (data.token) return { success: true, token: data.token }
		return { success: false, error: 'No token in response' }
	} catch (error) {
		console.error('Token refresh error:', error)
		return { success: false, error: 'Network error' }
	}
}

function buildRefreshUrl(subdomain?: string): string {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL
	if (!apiUrl) throw new Error('NEXT_PUBLIC_API_URL not configured')
	if (!subdomain) return `${apiUrl}${API_URL.AUTH.REFRESH}`

	const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN
	if (!rootDomain) {
		console.warn('NEXT_PUBLIC_ROOT_DOMAIN not set, using base URL')
		return `${apiUrl}${API_URL.AUTH.REFRESH}`
	}

	try {
		const url = new URL(apiUrl)
		url.hostname = `${subdomain}.${rootDomain}`
		return `${url.toString()}${API_URL.AUTH.REFRESH}`
	} catch (error) {
		console.error('Error building subdomain URL:', error)
		return `${apiUrl}${API_URL.AUTH.REFRESH}`
	}
}
