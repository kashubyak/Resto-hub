import { AUTH } from '@/constants/auth.constant'
import { ROUTES, type UserRole } from '@/constants/pages.constant'
import { getSubdomainFromHost } from '@/utils/api/subdomain'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
	redirectToHome,
	redirectToLogin,
	redirectToRoleHome,
} from './redirects'
import { getRoleForMiddleware } from './access-token-role'
import { hasRoleAccess } from './role-guards'
import { isAuthRoute, isPublicRoute } from './route-guards'
import { type IRefreshResult, refreshAccessToken } from './token-refresh'

function hasAccessToken(request: NextRequest): boolean {
	return !!request.cookies.get(AUTH.TOKEN)?.value
}

function canRefreshSession(request: NextRequest): boolean {
	return (
		request.cookies.get(AUTH.AUTH_STATUS)?.value === 'true' ||
		request.cookies.has('jid')
	)
}

function roleGuardOrNull(
	request: NextRequest,
	pathname: string,
): NextResponse | null {
	const role = getRoleForMiddleware(request)
	if (role === null) {
		if (!hasAccessToken(request)) return redirectToLogin(request, pathname)
		return null
	}
	if (!hasRoleAccess(role, pathname)) return redirectToRoleHome(request, role)
	return null
}

function roleHomeOrLogin(request: NextRequest): NextResponse {
	const role = getRoleForMiddleware(request)
	if (role === null) return redirectToHome(request)
	return redirectToRoleHome(request, role)
}

const ALERT_COOKIE_OPTIONS = {
	path: ROUTES.PRIVATE.SHARED.DASHBOARD,
	httpOnly: false,
}

const SESSION_EXPIRED_ALERT = JSON.stringify({
	severity: 'warning',
	text: AUTH.SESSION_EXPIRED_MESSAGE,
})

export async function authMiddleware(
	request: NextRequest,
): Promise<NextResponse> {
	const { pathname } = request.nextUrl
	const host = request.nextUrl.hostname ?? request.headers.get('host') ?? ''
	const subdomain = getSubdomainFromHost(host)

	if (
		subdomain &&
		(pathname.startsWith(ROUTES.PUBLIC.AUTH.REGISTER) ||
			pathname === ROUTES.PUBLIC.AUTH.REGISTER_SUCCESS)
	) {
		return redirectToLogin(request, pathname)
	}

	if (isPublicRoute(pathname)) return NextResponse.next()

	const accessToken = hasAccessToken(request)
	const canRefresh = canRefreshSession(request)
	const hasSession = accessToken || canRefresh

	if (isAuthRoute(pathname))
		return hasSession ? roleHomeOrLogin(request) : NextResponse.next()

	if (!accessToken && !canRefresh) return redirectToLogin(request, pathname)

	if (!accessToken && canRefresh) return handleTokenRefresh(request, pathname)

	const denied = roleGuardOrNull(request, pathname)
	if (denied) return denied
	return NextResponse.next()
}

const REFRESH_RETRY_DELAY_MS = 400

async function handleTokenRefresh(
	request: NextRequest,
	pathname: string,
): Promise<NextResponse> {
	const hadAuth = canRefreshSession(request)
	let refreshResult = await refreshAccessToken(request)

	if (!refreshResult.success) {
		await new Promise((r) => setTimeout(r, REFRESH_RETRY_DELAY_MS))
		refreshResult = await refreshAccessToken(request)
	}

	if (refreshResult.success) {
		if (refreshResult.user) {
			const role = refreshResult.user.role as UserRole
			if (!hasRoleAccess(role, pathname))
				return redirectToRoleHome(request, role)
		}

		return forwardCookiesAndContinue(refreshResult)
	}

	return handleSessionExpired(request, pathname, hadAuth)
}

function forwardCookiesAndContinue(
	refreshResult: IRefreshResult,
): NextResponse {
	const response = NextResponse.next()

	if (refreshResult.setCookieHeaders) {
		for (const setCookie of refreshResult.setCookieHeaders) {
			response.headers.append('Set-Cookie', setCookie)
		}
	}

	return response
}

function handleSessionExpired(
	request: NextRequest,
	currentPath: string,
	hadAuth: boolean,
): NextResponse {
	if (hasAccessToken(request)) {
		const denied = roleGuardOrNull(request, currentPath)
		if (denied) return denied
		return NextResponse.next()
	}

	const response = redirectToLogin(request, currentPath)
	if (hadAuth) {
		response.cookies.set(
			'pending-alert',
			encodeURIComponent(SESSION_EXPIRED_ALERT),
			ALERT_COOKIE_OPTIONS,
		)
	}
	return response
}
