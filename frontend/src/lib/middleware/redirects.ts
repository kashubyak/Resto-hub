import { ROUTES } from '@/constants/pages.constant'
import { NextRequest, NextResponse } from 'next/server'

export function redirectToLogin(request: NextRequest, currentPath: string): NextResponse {
	const loginUrl = new URL(ROUTES.PUBLIC.AUTH.LOGIN, request.url)
	loginUrl.searchParams.set('redirect', currentPath)
	return NextResponse.redirect(loginUrl)
}

export function redirectToHome(request: NextRequest): NextResponse {
	return NextResponse.redirect(new URL('/', request.url))
}

export function redirectToNotFound(request: NextRequest): NextResponse {
	return NextResponse.redirect(new URL(ROUTES.PUBLIC.NOT_FOUND, request.url))
}
