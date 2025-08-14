import { AUTH_ROUTES_LIST, PUBLIC_ROUTES_LIST } from '@/constants/pages'

export const isPublicRoute = (pathname: string): boolean =>
	PUBLIC_ROUTES_LIST.some(route => pathname.startsWith(route))

export const isAuthRoute = (pathname: string): boolean =>
	AUTH_ROUTES_LIST.some(route => pathname.startsWith(route))
