import { parse } from 'cookie'

const ACCESS_TOKEN_COOKIE = 'access_token'

export function parseAccessTokenFromCookieHeader(
	cookieHeader: string | undefined,
): string | undefined {
	if (!cookieHeader) return undefined

	const parsed = parse(cookieHeader)
	const raw = parsed[ACCESS_TOKEN_COOKIE]
	if (typeof raw !== 'string' || raw.length === 0) return undefined

	try {
		return decodeURIComponent(raw)
	} catch {
		return raw
	}
}
