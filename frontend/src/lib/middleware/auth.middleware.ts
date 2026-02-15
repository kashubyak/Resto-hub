import { AUTH } from '@/constants/auth.constant'
import { NextRequest, NextResponse } from 'next/server'
import { redirectToHome, redirectToLogin, redirectToNotFound } from './redirects'
import { hasRoleAccess } from './role-guards'
import { isAuthRoute, isPublicRoute } from './route-guards'
import { type IRefreshResult, refreshAccessToken } from './token-refresh'

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

	const isAuthenticated = request.cookies.get(AUTH.AUTH_STATUS)?.value === 'true'
	if (isAuthRoute(pathname)) return isAuthenticated ? redirectToHome(request) : NextResponse.next()

	if (isAuthenticated) return NextResponse.next()

	return handleTokenRefresh(request, pathname)
}

async function handleTokenRefresh(
	request: NextRequest,
	pathname: string,
): Promise<NextResponse> {
	const refreshResult = await refreshAccessToken(request)

	if (refreshResult.success) {
		if (refreshResult.user) {
			if (!hasRoleAccess(refreshResult.user.role, pathname)) return redirectToNotFound(request)
		}

		return forwardCookiesAndContinue(refreshResult)
	}

	return handleSessionExpired(request, pathname)
}

function forwardCookiesAndContinue(refreshResult: IRefreshResult): NextResponse {
	const response = NextResponse.next()

	if (refreshResult.setCookieHeaders) {
		for (const setCookie of refreshResult.setCookieHeaders) {
			response.headers.append('Set-Cookie', setCookie)
		}
	}

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
