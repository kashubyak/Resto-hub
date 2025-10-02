import { AUTH } from '@/constants/auth.constant'
import { convertToDays } from '@/utils/convertToDays'
import { NextRequest, NextResponse } from 'next/server'
import { decodeJWT } from './jwt-decoder'
import { redirectToHome, redirectToLogin, redirectToNotFound } from './redirects'
import { hasRoleAccess } from './role-guards'
import { isAuthRoute, isPublicRoute } from './route-guards'
import { refreshAccessToken } from './token-refresh'

const EXPIRES_IN_DAYS = convertToDays(process.env.NEXT_PUBLIC_JWT_EXPIRES_IN || '1d')
const MAX_AGE_MS = EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const COOKIE_OPTIONS = {
	httpOnly: false,
	secure: IS_PRODUCTION,
	sameSite: 'strict' as const,
	maxAge: MAX_AGE_MS,
	path: '/',
}

const ALERT_COOKIE_OPTIONS = {
	path: '/',
	httpOnly: false,
}

const SESSION_EXPIRED_ALERT = JSON.stringify({
	severity: 'warning',
	text: 'Your session has expired. Please log in again.',
})

export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
	const { pathname } = request.nextUrl
	if (isPublicRoute(pathname)) return NextResponse.next()
	const accessToken = request.cookies.get(AUTH.TOKEN)?.value
	if (isAuthRoute(pathname))
		return accessToken ? redirectToHome(request) : NextResponse.next()

	if (accessToken) {
		const decodedToken = decodeJWT(accessToken)

		if (decodedToken) {
			return hasRoleAccess(decodedToken.role, pathname)
				? NextResponse.next()
				: redirectToNotFound(request)
		}

		return handleTokenRefresh(request, pathname)
	}

	return handleTokenRefresh(request, pathname)
}

async function handleTokenRefresh(
	request: NextRequest,
	pathname: string,
): Promise<NextResponse> {
	const refreshResult = await refreshAccessToken(request)

	if (refreshResult.success && refreshResult.token) {
		const decodedToken = decodeJWT(refreshResult.token)
		if (decodedToken && hasRoleAccess(decodedToken.role, pathname))
			return setNewTokenAndContinue(refreshResult.token)
	}

	return handleSessionExpired(request, pathname)
}

function setNewTokenAndContinue(token: string): NextResponse {
	const response = NextResponse.next()
	response.cookies.set(AUTH.TOKEN, token, COOKIE_OPTIONS)
	return response
}

function handleSessionExpired(request: NextRequest, currentPath: string): NextResponse {
	const response = redirectToLogin(request, currentPath)
	response.cookies.set(
		'pending-alert',
		encodeURIComponent(SESSION_EXPIRED_ALERT),
		ALERT_COOKIE_OPTIONS,
	)
	return response
}
