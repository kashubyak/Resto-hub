import type { UserRole } from '@/constants/pages.constant'

export interface JwtPayload {
	role: UserRole
	exp: number
	iat: number
	sub: string
}
export const decodeJWT = (token: string): JwtPayload | null => {
	try {
		const parts = token.split('.')
		const payload = parts[1]

		const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4)
		const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'))
		const tokenData = JSON.parse(decodedPayload) as JwtPayload

		const currentTime = Math.floor(Date.now() / 1000)
		if (tokenData.exp && tokenData.exp < currentTime) return null
		return tokenData
	} catch (error) {
		console.error('Error decoding JWT:', error)
		return null
	}
}
