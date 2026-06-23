import { AUTH } from '@/constants/auth.constant'
import { getSocketServerUrl } from '@/lib/socket/getSocketServerUrl'
import { getSupabaseClient } from '@/lib/supabase/client'
import Cookies from 'js-cookie'
import { io, type Socket } from 'socket.io-client'

const SOCKET_AUTH_RETRY_ATTEMPTS = 3
const SOCKET_AUTH_RETRY_DELAY_MS = 300

export async function getSocketAuthToken(): Promise<string | undefined> {
	if (typeof window === 'undefined') return undefined
	try {
		const token = Cookies.get(AUTH.TOKEN)
		if (token) return token
		const {
			data: { session },
		} = await getSupabaseClient().auth.getSession()
		if (session?.access_token) return session.access_token
	} catch {
		//
	}
	return undefined
}

export async function getSocketAuthTokenWithRetry(): Promise<
	string | undefined
> {
	for (let attempt = 0; attempt < SOCKET_AUTH_RETRY_ATTEMPTS; attempt++) {
		if (attempt > 0)
			await new Promise((r) => setTimeout(r, SOCKET_AUTH_RETRY_DELAY_MS))
		const token = await getSocketAuthToken()
		if (token) return token
	}
	return undefined
}

export function createNotificationsSocket(
	token: string,
	socketUrl?: string | null,
): Socket | null {
	const url = socketUrl ?? getSocketServerUrl()
	if (url == null || url === '') return null
	return io(url, {
		auth: { token },
		transports: ['websocket'],
		withCredentials: true,
	})
}
