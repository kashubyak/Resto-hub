export function isAllowedWebSocketOrigin(origin: string | undefined): boolean {
	if (!origin) return true

	const allowedOrigins =
		process.env.ALLOWED_ORIGINS?.split(',').map((o) => o.trim()) ?? []
	if (allowedOrigins.includes(origin)) return true

	if (process.env.NODE_ENV === 'development') {
		if (/^https?:\/\/lvh\.me(:\d+)?$/.test(origin)) return true
		if (/^https?:\/\/[^.]+\.lvh\.me(:\d+)?$/.test(origin)) return true
		if (/^https?:\/\/localhost(:\d+)?$/.test(origin)) return true
		if (/^https?:\/\/127\.0\.0\.1(:\d+)?$/.test(origin)) return true
	}

	return false
}

export const WEBSOCKET_CORS_OPTIONS = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void,
	) => {
		if (isAllowedWebSocketOrigin(origin)) callback(null, true)
		else callback(new Error(`Not allowed by CORS: ${origin ?? 'unknown'}`))
	},
	credentials: true,
} as const
