import type { UserRole } from '@/constants/pages.constant'

export interface IJwtPayload {
	role: UserRole
	exp: number
	iat: number
	sub: string
}

const BASE64_REPLACEMENTS = [
	[/-/g, '+'],
	[/_/g, '/'],
] as const

export const decodeJWT = (token: string): IJwtPayload | null => {
	try {
		const parts = token.split('.')
		if (parts.length !== 3) return null

		const payload = parts[1]

		let paddedPayload = payload
		for (const [pattern, replacement] of BASE64_REPLACEMENTS)
			paddedPayload = paddedPayload.replace(pattern, replacement)

		const paddingLength = (4 - (paddedPayload.length % 4)) % 4
		if (paddingLength) paddedPayload += '='.repeat(paddingLength)

		const decodedPayload = atob(paddedPayload)
		const tokenData = JSON.parse(decodedPayload) as IJwtPayload

		if (tokenData.exp) {
			const currentTime = Math.floor(Date.now() / 1000)
			if (tokenData.exp < currentTime) return null
		}

		return tokenData
	} catch {
		return null
	}
}
