import { AUTH } from '@/constants/auth.constant'
import { convertToDays } from '@/utils/convertToDays'
import { NextRequest, NextResponse } from 'next/server'
import { redirectToHome, redirectToLogin } from './redirects'
import { isAuthRoute, isPublicRoute } from './route-guards'
import { refreshAccessToken } from './token-refresh'

export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
	const { pathname } = request.nextUrl
	if (isPublicRoute(pathname)) return NextResponse.next()

	const accessToken = request.cookies.get(AUTH.TOKEN)?.value

	if (isAuthRoute(pathname) && accessToken) return redirectToHome(request)
	if (!isAuthRoute(pathname)) {
		if (accessToken) return NextResponse.next()
		const refreshResult = await refreshAccessToken(request)
		if (refreshResult.success && refreshResult.token)
			return setNewTokenAndContinue(refreshResult.token)
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
