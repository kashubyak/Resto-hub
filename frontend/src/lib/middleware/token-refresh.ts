import { API_URL } from '@/config/api'
import { NextRequest } from 'next/server'

interface IRefreshResult {
	success: boolean
	token?: string
	error?: string
}

export async function refreshAccessToken(request: NextRequest): Promise<IRefreshResult> {
	try {
		const refreshUrl = buildRefreshUrl()
		const response = await fetch(refreshUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: request.headers.get('cookie') || '',
			},
			credentials: 'include',
		})

		if (!response.ok) return { success: false, error: `HTTP ${response.status}` }

		const data = await response.json()
		if (data.token) return { success: true, token: data.token }
		return { success: false, error: 'No token in response' }
	} catch {
		return { success: false, error: 'Network error' }
	}
}

function buildRefreshUrl(): string {
	return `${process.env.NEXT_PUBLIC_API_URL}${API_URL.AUTH.REFRESH}`
}
