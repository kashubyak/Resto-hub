import {
	ROLE_DEFAULT_ROUTE,
	ROUTES,
	type UserRole,
} from '@/constants/pages.constant'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function redirectToLogin(
	request: NextRequest,
	currentPath: string,
): NextResponse {
	const loginUrl = new URL(ROUTES.PUBLIC.AUTH.LOGIN, request.url)
	loginUrl.searchParams.set('redirect', currentPath)
	return NextResponse.redirect(loginUrl)
}

export function redirectToHome(request: NextRequest): NextResponse {
	return NextResponse.redirect(
		new URL(ROUTES.PRIVATE.SHARED.DASHBOARD, request.url),
	)
}

export function redirectToRoleHome(
	request: NextRequest,
	role: UserRole,
): NextResponse {
	const destination =
		ROLE_DEFAULT_ROUTE[role] ?? ROUTES.PRIVATE.SHARED.DASHBOARD
	return NextResponse.redirect(new URL(destination, request.url))
}

export function redirectToNotFound(request: NextRequest): NextResponse {
	return NextResponse.redirect(new URL(ROUTES.PUBLIC.NOT_FOUND, request.url))
}
