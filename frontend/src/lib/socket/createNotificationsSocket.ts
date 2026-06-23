import { getSocketServerUrl } from '@/lib/socket/getSocketServerUrl'
import { io, type Socket } from 'socket.io-client'

export function createNotificationsSocket(
	socketUrl?: string | null,
): Socket | null {
	const url = socketUrl ?? getSocketServerUrl()
	if (url == null || url === '') return null
	return io(url, {
		transports: ['websocket'],
		withCredentials: true,
		autoConnect: true,
	})
}
