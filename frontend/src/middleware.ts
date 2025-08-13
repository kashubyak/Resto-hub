import { AUTH_ROUTES_LIST, PUBLIC_ROUTES_LIST, ROUTES } from '@/constants/pages'
import { NextRequest, NextResponse } from 'next/server'

const isPublicRoute = (pathname: string): boolean =>
	PUBLIC_ROUTES_LIST.some(route => pathname.startsWith(route))

const isAuthRoute = (pathname: string): boolean =>
	AUTH_ROUTES_LIST.some(route => pathname.startsWith(route))

async function refreshAccessToken(
	request: NextRequest,
	subdomain?: string,
): Promise<{ success: boolean; token?: string; error?: string }> {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL
		if (!apiUrl) return { success: false, error: 'API URL is not set' }

		let refreshUrl = `${apiUrl}/auth/refresh`
		if (subdomain) {
			const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost'
			try {
				const url = new URL(apiUrl)
				url.hostname = `${subdomain}.${rootDomain}`
				refreshUrl = `${url.toString()}/auth/refresh`
			} catch (e) {
				console.error('Error forming URL with subdomain:', e)
			}
		}

		const response = await fetch(refreshUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Cookie: request.headers.get('cookie') || '',
			},
			credentials: 'include',
		})

		if (!response.ok) return { success: false, error: `HTTP ${response.status}` }

		const data = await response.json()
		if (data.token) return { success: true, token: data.token }

		return { success: false, error: 'Token not received' }
	} catch (error) {
		console.error('Error refreshing token:', error)
		return { success: false, error: 'Network error' }
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const response = NextResponse.next()

	if (isPublicRoute(pathname)) return response

	const accessToken = request.cookies.get('access_token')?.value
	const subdomain = request.cookies.get('subdomain')?.value

	if (isAuthRoute(pathname) && accessToken) {
		return NextResponse.redirect(new URL('/', request.url))
	}

	if (!isPublicRoute(pathname) && !isAuthRoute(pathname)) {
		if (accessToken) return response

		const refreshResult = await refreshAccessToken(request, subdomain)

		if (refreshResult.success && refreshResult.token) {
			const newResponse = NextResponse.next()
			const tokenExpiresIn = process.env.NEXT_PUBLIC_JWT_EXPIRES_IN || '1d'
			const expirationDays =
				tokenExpiresIn === '1d'
					? 1
					: tokenExpiresIn === '7d'
					? 7
					: tokenExpiresIn === '30d'
					? 30
					: 1

			newResponse.cookies.set('access_token', refreshResult.token, {
				httpOnly: false,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: expirationDays * 24 * 60 * 60 * 1000,
				path: '/',
			})

			return newResponse
		}

		const loginUrl = new URL(ROUTES.PUBLIC.AUTH.LOGIN, request.url)
		loginUrl.searchParams.set('redirect', pathname)
		return NextResponse.redirect(loginUrl)
	}

	return response
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
