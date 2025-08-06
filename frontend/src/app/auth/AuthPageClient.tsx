'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { LoginCompany } from './LoginCompany'
import { RegisterCompany } from './RegisterCompany'

export default function AuthPageClient({ mode }: { mode: string }) {
	const router = useRouter()

	useEffect(() => {
		if (mode !== 'login' && mode !== 'register') {
			router.replace('/auth/login')
		}
	}, [mode, router])

	if (mode === 'login') return <LoginCompany />
	if (mode === 'register') return <RegisterCompany />
	return null
}
