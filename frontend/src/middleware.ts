import { NextRequest } from 'next/server'
import { authMiddleware } from './lib/middleware/auth.middleware'

export async function middleware(request: NextRequest) {
	return await authMiddleware(request)
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
