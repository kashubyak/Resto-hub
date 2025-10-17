import { API_URL } from '@/config/api'
import { NextRequest } from 'next/server'

interface IRefreshResult {
	success: boolean
	token?: string
	error?: string
}

const REFRESH_URL = `${process.env.NEXT_PUBLIC_API_URL}${API_URL.AUTH.REFRESH}`

const FETCH_OPTIONS_BASE = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
	},
	credentials: 'include' as RequestCredentials,
}

export async function refreshAccessToken(request: NextRequest): Promise<IRefreshResult> {
	try {
		const cookie = request.headers.get('cookie')

		const response = await fetch(REFRESH_URL, {
			...FETCH_OPTIONS_BASE,
			headers: {
				...FETCH_OPTIONS_BASE.headers,
				...(cookie && { Cookie: cookie }),
			},
		})

		if (!response.ok) return { success: false, error: `HTTP ${response.status}` }
		const data = await response.json()

		return data.token
			? { success: true, token: data.token }
			: { success: false, error: 'No token in response' }
	} catch (error) {
		if (process.env.NODE_ENV !== 'production')
			console.error('Token refresh error:', error)
		return { success: false, error: 'Network error' }
	}
}
