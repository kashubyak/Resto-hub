import { API_URL } from '@/config/api'
import { AUTH } from '@/constants/auth.constant'
import { getSupabaseClient } from '@/lib/supabase/client'
import Cookies from 'js-cookie'
import { io, type Socket } from 'socket.io-client'

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

export function createNotificationsSocket(token: string): Socket | null {
	const url = API_URL.BASE_SOCKET
	if (url == null || url === '') return null
	return io(url, {
		auth: { token },
		transports: ['websocket'],
		withCredentials: true,
	})
}
