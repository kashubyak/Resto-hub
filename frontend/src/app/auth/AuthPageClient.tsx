'use client'

import { ROUTES } from '@/constants/pages.constant'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { memo, useEffect } from 'react'

const Login = dynamic(
	() => import('./Login').then((m) => ({ default: m.Login })),
	{ ssr: false, loading: () => <AuthPageLoadingFallback /> },
)

const RegisterCompany = dynamic(
	() => import('./RegisterCompany').then((m) => ({ default: m.RegisterCompany })),
	{ ssr: false, loading: () => <AuthPageLoadingFallback /> },
)

function AuthPageLoadingFallback() {
	return (
		<div className="min-h-screen w-full flex items-center justify-center bg-background">
			<p className="text-sm text-muted-foreground">Loading…</p>
		</div>
	)
}

const AuthPageClientComponent = ({
	mode,
	host = '',
}: {
	mode: 'login' | 'register'
	host?: string
}) => {
	const router = useRouter()
	useEffect(() => {
		if (!mode) router.replace(ROUTES.PUBLIC.AUTH.LOGIN)
	}, [mode, router])

	if (mode === 'login') return <Login host={host} />
	if (mode === 'register') return <RegisterCompany />
	return null
}
export const AuthPageClient = memo(AuthPageClientComponent)
