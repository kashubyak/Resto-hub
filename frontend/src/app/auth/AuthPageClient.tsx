'use client'

import { ROUTES } from '@/constants/pages.constant'
import { useRouter } from 'next/navigation'
import { memo, useEffect } from 'react'
import { Login } from './Login'
import { RegisterCompany } from './RegisterCompany'

const AuthPageClientComponent = ({ mode }: { mode: 'login' | 'register' }) => {
	const router = useRouter()
	useEffect(() => {
		if (!mode) router.replace(ROUTES.PUBLIC.AUTH.LOGIN)
	}, [mode, router])

	if (mode === 'login') return <Login />
	if (mode === 'register') return <RegisterCompany />
	return null
}
export const AuthPageClient = memo(AuthPageClientComponent)
