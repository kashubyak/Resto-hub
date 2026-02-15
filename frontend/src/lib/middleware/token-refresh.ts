import { API_URL } from '@/config/api'
import { NextRequest } from 'next/server'

export interface IRefreshResult {
	success: boolean
	setCookieHeaders?: string[]
	user?: { id: number; role: string }
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

		const data = (await response.json()) as { success: boolean; user?: { id: number; role: string } }

		if (!data.success) return { success: false, error: 'Refresh failed' }

		const setCookieHeaders = response.headers.getSetCookie()

		return {
			success: true,
			setCookieHeaders,
			user: data.user,
		}
	} catch {
		return { success: false, error: 'Network error' }
	}
}
