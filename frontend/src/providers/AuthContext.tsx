'use client'

import { initApiFromCookies } from '@/utils/api'
import { useEffect, type ReactNode } from 'react'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	useEffect(() => {
		initApiFromCookies()
	}, [])

	return <>{children}</>
}
