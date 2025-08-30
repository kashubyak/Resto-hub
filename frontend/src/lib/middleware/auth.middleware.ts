import { AUTH } from '@/constants/auth.constant'
import { convertToDays } from '@/utils/convertToDays'
import { NextRequest, NextResponse } from 'next/server'
import { decodeJWT } from './jwt-decoder'
import { redirectToHome, redirectToLogin, redirectToNotFound } from './redirects'
import { hasRoleAccess } from './role-guards'
import { isAuthRoute, isPublicRoute } from './route-guards'
import { refreshAccessToken } from './token-refresh'

export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
	const { pathname } = request.nextUrl
	if (isPublicRoute(pathname)) return NextResponse.next()

	const accessToken = request.cookies.get(AUTH.TOKEN)?.value

	if (isAuthRoute(pathname) && accessToken) return redirectToHome(request)
	if (!isAuthRoute(pathname)) {
		if (accessToken) {
			const decodedToken = decodeJWT(accessToken)

			if (!decodedToken) {
				const refreshResult = await refreshAccessToken(request)
				if (refreshResult.success && refreshResult.token) {
					const newDecodedToken = decodeJWT(refreshResult.token)
					if (newDecodedToken && hasRoleAccess(newDecodedToken.role, pathname)) {
						return setNewTokenAndContinue(refreshResult.token)
					}
				}
				return redirectToLogin(request, pathname)
			}

			if (!hasRoleAccess(decodedToken.role, pathname)) return redirectToNotFound(request)
			return NextResponse.next()
		}

		const refreshResult = await refreshAccessToken(request)
		if (refreshResult.success && refreshResult.token) {
			const decodedToken = decodeJWT(refreshResult.token)
			if (decodedToken && hasRoleAccess(decodedToken.role, pathname)) {
				return setNewTokenAndContinue(refreshResult.token)
			}
		}
		return redirectToLogin(request, pathname)
	}
	return NextResponse.next()
}

function setNewTokenAndContinue(token: string): NextResponse {
	const response = NextResponse.next()

	const expiresInDays = convertToDays(process.env.NEXT_PUBLIC_JWT_EXPIRES_IN || '1d')

	response.cookies.set(AUTH.TOKEN, token, {
		httpOnly: false,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: expiresInDays * 24 * 60 * 60 * 1000,
		path: '/',
	})

	return response
}
