'use client'

import { ROUTES } from '@/constants/pages.config'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Login } from './Login'
import { RegisterCompany } from './RegisterCompany'

export default function AuthPageClient({ mode }: { mode: string }) {
	const router = useRouter()
	useEffect(() => {
		if (mode !== 'login' && mode !== 'register') router.replace(ROUTES.AUTH.LOGIN)
	}, [mode, router])

	if (mode === 'login') return <Login />
	if (mode === 'register') return <RegisterCompany />
	return null
}
