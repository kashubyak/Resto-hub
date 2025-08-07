'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Login } from './Login'
import { RegisterCompany } from './RegisterCompany'

export default function AuthPageClient({ mode }: { mode: string }) {
	const router = useRouter()
	useEffect(() => {
		if (mode !== 'login' && mode !== 'register') router.replace('/auth/login')
	}, [mode, router])

	if (mode === 'login') return <Login />
	if (mode === 'register') return <RegisterCompany />
	return null
}
